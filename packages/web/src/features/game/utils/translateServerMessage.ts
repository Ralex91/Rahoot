import { useLanguageStore } from "@rahoot/web/hooks/useTranslation";

/**
 * Maps known English messages from the server to i18n keys.
 * The server sends hardcoded English; we translate client-side.
 */
const serverMessageMap: Record<string, string> = {
  // ── Game errors ──
  "Player already connected": "server.playerAlreadyConnected",
  "No players connected": "server.noPlayersConnected",
  "Game not found": "server.gameNotFound",
  "Game expired": "server.gameExpired",
  "Quizz not found": "server.quizNotFound",

  // ── Manager errors ──
  "Not authenticated as manager": "server.notAuthenticated",
  "Manager password is not configured": "server.passwordNotConfigured",
  "Invalid password": "server.invalidPassword",
  "Failed to read game config": "server.failedReadConfig",
  "Manager disconnected": "server.managerDisconnected",

  // ── Reset messages ──
  "Manager already connected": "server.managerAlreadyConnected",
  "You have been kicked by the manager": "server.kickedByManager",

  // ── Avatar errors ──
  "Invalid token. Cannot modify avatar.": "server.invalidToken",
  "Avatar already exists. Provide token to modify.": "server.avatarExists",
  "Failed to save avatar": "server.failedSaveAvatar",

  // ── Quiz management ──
  "Failed to create quiz": "server.failedCreateQuiz",
  "Failed to import quiz": "server.failedImportQuiz",
  "Failed to delete quiz": "server.failedDeleteQuiz",
  "Quiz not found": "server.quizFileNotFound",
  "Quiz with this name already exists": "server.quizAlreadyExists",

  // ── Zod validators ──
  "Username cannot be less than 4 characters": "server.usernameTooShort",
  "Username cannot exceed 20 characters": "server.usernameTooLong",
  "Invalid invite code": "server.invalidInviteCode",
};

/**
 * Translates a server message using the global i18n store.
 * Falls back to the raw English message if no mapping exists.
 */
export function translateServerMessage(message: string): string {
  const key = serverMessageMap[message];
  if (!key) return message;

  const { t } = useLanguageStore.getState();
  return t(key);
}
