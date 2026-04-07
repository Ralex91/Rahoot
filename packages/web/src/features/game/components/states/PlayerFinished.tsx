import type { CommonStatusDataMap } from "@rahoot/common/types/game/status";
import Button from "@rahoot/web/features/game/components/Button";
import { usePlayerStore } from "@rahoot/web/features/game/stores/player";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";
import useScreenSize from "@rahoot/web/hooks/useScreenSize";
import { SFX_PODIUM_FIRST } from "@rahoot/web/features/game/utils/constants";
import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import clsx from "clsx";

type Props = {
  data: CommonStatusDataMap["FINISHED"];
};

const MEDAL_STYLES = [
  "border-amber-400 bg-gradient-to-b from-amber-300 to-amber-500 text-amber-900",
  "border-zinc-300 bg-gradient-to-b from-zinc-200 to-zinc-400 text-zinc-700",
  "border-amber-700 bg-gradient-to-b from-amber-600 to-amber-800 text-amber-200",
];

const MEDAL_EMOJI = ["🥇", "🥈", "🥉"];

const PlayerFinished = ({ data: { subject, top } }: Props) => {
  const { player } = usePlayerStore();
  const { t } = useTranslation();
  const { width, height } = useScreenSize();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [sfxFirst] = useSound(SFX_PODIUM_FIRST, { volume: 0.2 });

  // Find player's position in top 3
  const playerInTop = top.findIndex(
    (p) => p.username === player?.username,
  );
  const isWinner = playerInTop === 0;

  useEffect(() => {
    // Staggered reveal
    const t1 = setTimeout(() => setShowContent(true), 300);
    const t2 = setTimeout(() => {
      setShowConfetti(true);
      sfxFirst();
    }, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [sfxFirst]);

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={isWinner ? 400 : 200}
          gravity={0.15}
          className="fixed top-0 left-0 z-50 pointer-events-none"
        />
      )}

      <section className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-6 gap-6">
        {/* Title */}
        <div
          className={clsx(
            "text-center transition-all duration-700",
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8",
          )}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
            {t("finished.gameOver")}
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-medium">
            {subject}
          </p>
        </div>

        {/* Player's own result */}
        {player && (
          <div
            className={clsx(
              "w-full max-w-sm rounded-xl p-5 text-center transition-all duration-700 delay-200",
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
              playerInTop >= 0
                ? "bg-gradient-to-br from-amber-400/30 to-amber-600/30 border-2 border-amber-400/50"
                : "bg-white/15 border-2 border-white/20",
            )}
            style={{ backdropFilter: "blur(10px)" }}
          >
            {player.avatar && (
              <span className="text-5xl block mb-2">{player.avatar}</span>
            )}
            <p className="text-2xl font-bold text-white mb-1">
              {player.username}
            </p>
            <p className="text-4xl font-extrabold text-white drop-shadow-md mb-1">
              {player.points} {t("game.points")}
            </p>
            {playerInTop >= 0 && (
              <p className="text-xl font-bold text-amber-300 mt-2">
                {MEDAL_EMOJI[playerInTop]} {t(`finished.rank${playerInTop + 1}`)}
              </p>
            )}
          </div>
        )}

        {/* Mini podium - top 3 */}
        <div
          className={clsx(
            "w-full max-w-md transition-all duration-700 delay-500",
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8",
          )}
        >
          <h3 className="text-center text-lg font-bold text-white/70 mb-3 uppercase tracking-wider">
            {t("finished.topPlayers")}
          </h3>
          <div className="flex flex-col gap-2">
            {top.map((p, idx) => (
              <div
                key={p.id}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                  p.username === player?.username
                    ? "bg-white/25 ring-2 ring-white/40"
                    : "bg-white/10",
                )}
              >
                <span
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold",
                    MEDAL_STYLES[idx],
                  )}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-lg truncate flex items-center gap-2">
                    {p.avatar && <span className="text-xl">{p.avatar}</span>}
                    {p.username}
                  </p>
                </div>
                <span className="text-white/90 font-bold text-lg tabular-nums">
                  {p.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div
          className={clsx(
            "flex flex-col sm:flex-row gap-3 w-full max-w-sm transition-all duration-700 delay-700",
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8",
          )}
        >
          <Button
            onClick={() => (window.location.href = "/")}
            className="flex-1 text-lg py-3"
          >
            {t("finished.playAgain")}
          </Button>
        </div>
      </section>
    </>
  );
};

export default PlayerFinished;
