import { STATUS } from "@rahoot/common/types/game/status";
import AvatarSelector from "@rahoot/web/features/game/components/avatar/AvatarSelector";
import Button from "@rahoot/web/features/game/components/Button";
import Form from "@rahoot/web/features/game/components/Form";
import Input from "@rahoot/web/features/game/components/Input";
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider";
import { usePlayerStore } from "@rahoot/web/features/game/stores/player";
import { type KeyboardEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";
import { translateServerMessage } from "@rahoot/web/features/game/utils/translateServerMessage";

// ─── LocalStorage helpers ──────────────────────────────────────
const TOKENS_KEY = "rahoot_tokens";

function getSavedTokens(): Record<string, string> {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToken(username: string, token: string) {
  try {
    const tokens = getSavedTokens();
    tokens[username.toLowerCase()] = token;
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } catch {}
}

function getTokenForUser(username: string): string | null {
  return getSavedTokens()[username.toLowerCase()] || null;
}

function removeTokenForUser(username: string) {
  try {
    const tokens = getSavedTokens();
    delete tokens[username.toLowerCase()];
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } catch {}
}

// ─── Component ─────────────────────────────────────────────────
const Username = () => {
  const { socket } = useSocket();
  const { gameId, login, setStatus } = usePlayerStore();
  const { t, changeLanguage, locale } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Token state
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [serverAvatar, setServerAvatar] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Show token to user after first creation (one-time reveal)
  const [revealedToken, setRevealedToken] = useState<string | null>(null);
  // Manual reclaim mode (for other-device scenario)
  const [showReclaimInput, setShowReclaimInput] = useState(false);
  const [reclaimToken, setReclaimToken] = useState("");

  // ─── Debounced avatar fetch on username change ───────────────
  useEffect(() => {
    setServerAvatar(null);
    setIsOwner(false);
    setCurrentToken(null);
    setAvatar("");
    setRevealedToken(null);
    setShowReclaimInput(false);
    setReclaimToken("");

    if (!username.trim()) return;

    const timer = setTimeout(() => {
      socket?.emit("player:getAvatar", username.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [username, socket]);

  // ─── Server: avatar data for this username ───────────────────
  useEvent("player:avatarData", (data) => {
    if (!data) {
      // No avatar exists → user is free to create one
      setServerAvatar(null);
      setIsOwner(true);
      return;
    }

    setServerAvatar(data.avatar);
    setAvatar(data.avatar);

    // Check localStorage for matching token
    const localToken = getTokenForUser(username);
    if (localToken && localToken === data.token) {
      setIsOwner(true);
      setCurrentToken(localToken);
    } else {
      // Avatar exists but we don't own it
      setIsOwner(false);
      setCurrentToken(null);
    }
  });

  // ─── Server: avatar saved confirmation ───────────────────────
  useEvent("player:avatarSaved", (result) => {
    setIsLoading(false);
    if (result.success && result.token) {
      // Reveal token if this is a first creation (no server avatar existed)
      // or if user just reclaimed from another device
      const isFirstCreation = !serverAvatar;
      const isReclaim = showReclaimInput;

      saveToken(username, result.token);
      setCurrentToken(result.token);
      setIsOwner(true);
      setServerAvatar(avatar);
      setShowAvatarPicker(false);
      setShowReclaimInput(false);
      setReclaimToken("");

      if (isFirstCreation || isReclaim) {
        setRevealedToken(result.token);
      }

      toast.success(t("username.avatarSaved"));
    } else {
      toast.error(translateServerMessage(result.error) || t("common.error"));
    }
  });

  // ─── Join game ───────────────────────────────────────────────
  useEvent("game:successJoin", (joinedGameId) => {
    setStatus(STATUS.WAIT, { text: "Waiting for players" });
    login(username, avatar, currentToken);
    navigate(`/party/${joinedGameId}`);
  });

  // ─── Actions ─────────────────────────────────────────────────
  const handleLogin = () => {
    if (!gameId || !username.trim()) return;

    socket?.emit("player:login", {
      gameId,
      data: {
        username: username.trim(),
        avatar: avatar || "",
        token: currentToken,
      },
    });
  };

  const handleSaveAvatar = () => {
    if (!username.trim()) {
      toast.error(t("username.pleaseEnterUsername"));
      return;
    }
    if (!avatar) {
      toast.error(t("username.pleaseSelectAvatar"));
      return;
    }
    setIsLoading(true);
    socket?.emit("player:saveAvatar", {
      username: username.trim(),
      avatar,
      token: currentToken,
    });
  };

  const handleReclaim = () => {
    if (!reclaimToken.trim()) {
      toast.error(t("username.pleaseEnterToken"));
      return;
    }
    setIsLoading(true);
    // Try saving with the provided token to prove ownership
    socket?.emit("player:saveAvatar", {
      username: username.trim(),
      avatar: serverAvatar || avatar || "",
      token: reclaimToken.trim(),
    });
  };

  const handleReleaseAvatar = () => {
    if (!currentToken) return;
    removeTokenForUser(username);
    setIsOwner(false);
    setCurrentToken(null);
    setRevealedToken(null);
    toast.success(t("username.avatarReleased"));
  };

  const handleCopyToken = async () => {
    const tokenToCopy = revealedToken || currentToken;
    if (!tokenToCopy) return;
    try {
      await navigator.clipboard.writeText(tokenToCopy);
      toast.success(t("username.tokenCopied"));
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = tokenToCopy;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success(t("username.tokenCopied"));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") handleLogin();
  };

  const handleSubmit = () => {
    if (!username.trim()) {
      toast.error(t("username.pleaseEnterUsername"));
      return;
    }
    handleLogin();
  };

  return (
    <div className="relative z-10">
      {/* Language selector */}
      <div className="mb-4 flex justify-end">
        <select
          value={locale}
          onChange={(e) => changeLanguage(e.target.value)}
          className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="it">Italiano</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <Form>
        {/* Username */}
        <div className="mb-4">
          <Input
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("username.placeholder")}
            value={username}
          />
        </div>

        {/* Avatar section — only when username is filled */}
        {username.trim() && (
          <div className="mb-4">
            {/* ── Avatar picker open ── */}
            {showAvatarPicker ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-center text-lg font-semibold text-gray-700">
                  {t("username.chooseAvatar")}
                </h3>
                <AvatarSelector
                  onSelect={(a) => setAvatar(a || "")}
                  selectedAvatar={avatar}
                  disabled={false}
                />
                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    onClick={handleSaveAvatar}
                    disabled={isLoading || !avatar}
                    className="flex-1"
                  >
                    {isLoading
                      ? t("common.loading")
                      : t("username.saveAvatar")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAvatarPicker(false);
                      if (serverAvatar) setAvatar(serverAvatar);
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* ── Current avatar display ── */}
                {avatar ? (
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <span className="text-3xl">{avatar}</span>
                    <span className="flex-1 text-sm text-gray-600">
                      {t("username.avatarSelected")}
                    </span>
                    {isOwner && (
                      <Button
                        type="button"
                        onClick={() => setShowAvatarPicker(true)}
                        variant="secondary"
                        size="sm"
                      >
                        {t("username.modifyAvatar")}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setShowAvatarPicker(true)}
                    variant="outline"
                    className="w-full"
                  >
                    {t("username.selectAvatar")}
                  </Button>
                )}

                {/* ── Token revealed after first creation ── */}
                {revealedToken && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="mb-1 text-sm font-semibold text-amber-800">
                      {t("username.tokenRevealTitle")}
                    </p>
                    <p className="mb-2 text-xs text-amber-700">
                      {t("username.tokenRevealExplanation")}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-amber-100 px-2 py-1 text-xs font-mono text-amber-900 break-all">
                        {revealedToken}
                      </code>
                      <Button
                        type="button"
                        onClick={handleCopyToken}
                        variant="secondary"
                        size="sm"
                      >
                        {t("username.copyToken")}
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRevealedToken(null)}
                      className="mt-2 text-xs text-amber-600 hover:text-amber-800 underline"
                    >
                      {t("username.dismissToken")}
                    </button>
                  </div>
                )}

                {/* ── Reclaim from another device ── */}
                {!isOwner && serverAvatar && !showReclaimInput && (
                  <button
                    type="button"
                    onClick={() => setShowReclaimInput(true)}
                    className="mt-2 w-full text-center text-xs text-blue-400 hover:text-blue-600 transition-colors underline"
                  >
                    {t("username.reclaimLink")}
                  </button>
                )}

                {showReclaimInput && (
                  <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="mb-2 text-xs text-blue-700">
                      {t("username.reclaimExplanation")}
                    </p>
                    <Input
                      type="text"
                      value={reclaimToken}
                      onChange={(e) => setReclaimToken(e.target.value)}
                      placeholder={t("username.tokenPlaceholder")}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleReclaim}
                        disabled={isLoading || !reclaimToken.trim()}
                        size="sm"
                        className="flex-1"
                      >
                        {isLoading
                          ? t("common.loading")
                          : t("username.reclaimButton")}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowReclaimInput(false);
                          setReclaimToken("");
                        }}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* ── Release avatar (owner only) ── */}
                {isOwner && currentToken && (
                  <button
                    type="button"
                    onClick={handleReleaseAvatar}
                    className="mt-2 w-full text-center text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {t("username.releaseAvatar")}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <Button onClick={handleSubmit} disabled={isLoading}>
          {t("common.submit")}
        </Button>
      </Form>
    </div>
  );
};

export default Username;
