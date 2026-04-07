import type { ManagerStatusDataMap } from "@rahoot/common/types/game/status";
import {
  SFX_PODIUM_FIRST,
  SFX_PODIUM_SECOND,
  SFX_PODIUM_THREE,
  SFX_SNEAR_ROOL,
} from "@rahoot/web/features/game/utils/constants";
import useScreenSize from "@rahoot/web/hooks/useScreenSize";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import useSound from "use-sound";
import Button from "@rahoot/web/features/game/components/Button";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";

type Props = {
  data: ManagerStatusDataMap["FINISHED"];
};

const usePodiumAnimation = (topLength: number) => {
  const [apparition, setApparition] = useState(0);

  const [sfxtThree] = useSound(SFX_PODIUM_THREE, { volume: 0.2 });
  const [sfxSecond] = useSound(SFX_PODIUM_SECOND, { volume: 0.2 });
  const [sfxRool, { stop: sfxRoolStop }] = useSound(SFX_SNEAR_ROOL, {
    volume: 0.2,
  });
  const [sfxFirst] = useSound(SFX_PODIUM_FIRST, { volume: 0.2 });

  useEffect(() => {
    const actions: Partial<Record<number, () => void>> = {
      4: () => {
        sfxRoolStop();
        sfxFirst();
      },
      3: sfxRool,
      2: sfxSecond,
      1: sfxtThree,
    };

    actions[apparition]?.();
  }, [apparition, sfxFirst, sfxSecond, sfxtThree, sfxRool, sfxRoolStop]);

  useEffect(() => {
    if (topLength < 3) {
      setApparition(4);
      return;
    }

    if (apparition >= 4) {
      return;
    }

    const interval = setInterval(() => {
      setApparition((value) => value + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [apparition, topLength]);

  return apparition;
};

const PODIUM_HEIGHTS = ["h-[60%]", "h-[50%]", "h-[40%]"];
const PODIUM_Z = ["z-30", "z-20", "z-10"];
const MEDAL_COLORS = [
  "border-amber-400 bg-amber-300",
  "border-zinc-400 bg-zinc-500",
  "border-amber-800 bg-amber-700",
];
const MEDAL_ORDER = [1, 0, 2]; // Display order: silver, gold, bronze

const Podium = ({ data: { subject, top } }: Props) => {
  const apparition = usePodiumAnimation(top.length);
  const { t } = useTranslation();
  const { width, height } = useScreenSize();

  const showOrder =
    top.length >= 3 ? MEDAL_ORDER : top.map((_, i) => i);

  return (
    <>
      {apparition >= 4 && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.12}
          className="fixed top-0 left-0 pointer-events-none"
        />
      )}

      {apparition >= 3 && top.length >= 3 && (
        <div className="pointer-events-none absolute min-h-dvh w-full overflow-hidden">
          <div className="spotlight"></div>
        </div>
      )}

      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-between py-4">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="anim-show text-3xl font-extrabold text-white drop-shadow-lg md:text-5xl mb-1">
            {t("finished.gameOver")}
          </h2>
          <p className="text-xl text-white/70 font-medium">{subject}</p>
        </div>

        {/* Podium bars */}
        <div
          style={{ gridTemplateColumns: `repeat(${top.length}, 1fr)` }}
          className="grid w-full max-w-200 flex-1 items-end justify-center overflow-x-visible overflow-y-hidden"
        >
          {showOrder.map((playerIdx) => {
            const player = top[playerIdx];
            if (!player) return null;

            const apparitionThreshold =
              playerIdx === 0 ? 3 : playerIdx === 1 ? 2 : 1;

            return (
              <div
                key={player.id}
                className={clsx(
                  `${PODIUM_Z[playerIdx]} flex ${PODIUM_HEIGHTS[playerIdx]} w-full translate-y-full flex-col items-center gap-3 opacity-0 transition-all duration-700`,
                  {
                    "translate-y-0! opacity-100":
                      apparition >= apparitionThreshold,
                  },
                  { "md:min-w-64": top.length < 2 && playerIdx === 0 },
                )}
              >
                <p
                  className={clsx(
                    "overflow-visible text-center text-2xl font-bold whitespace-nowrap text-white drop-shadow-lg md:text-4xl",
                    apparition >= 4
                      ? "anim-balanced opacity-100"
                      : playerIdx === 0
                        ? "opacity-0"
                        : "",
                  )}
                >
                  {player.avatar && (
                    <span className="mr-2 text-3xl md:text-4xl">
                      {player.avatar}
                    </span>
                  )}
                  {player.username}
                </p>

                <div className="bg-primary flex h-full w-full flex-col items-center gap-4 rounded-t-md pt-6 text-center shadow-2xl">
                  <p
                    className={clsx(
                      "flex aspect-square h-14 items-center justify-center rounded-full border-4 text-3xl font-bold text-white drop-shadow-lg",
                      MEDAL_COLORS[playerIdx],
                    )}
                  >
                    <span className="drop-shadow-md">{playerIdx + 1}</span>
                  </p>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">
                    {player.points}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom actions — visible after animation */}
        <div
          className={clsx(
            "mt-4 flex gap-3 transition-all duration-500",
            apparition >= 4
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
        >
          <Button
            onClick={() => (window.location.href = "/manager")}
            className="px-8 py-3 text-lg"
          >
            {t("finished.newQuiz")}
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="secondary"
            className="px-8 py-3 text-lg"
          >
            {t("game.returnHome")}
          </Button>
        </div>
      </section>
    </>
  );
};

export default Podium;
