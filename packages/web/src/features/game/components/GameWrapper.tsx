import type {
  PropsWithChildren,
  Status,
} from "@rahoot/common/types/game/status";
import background from "@rahoot/web/assets/background.webp";
import Button from "@rahoot/web/features/game/components/Button";
import Loader from "@rahoot/web/features/game/components/Loader";
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider";
import { usePlayerStore } from "@rahoot/web/features/game/stores/player";
import { useQuestionStore } from "@rahoot/web/features/game/stores/question";
import { MANAGER_SKIP_BTN } from "@rahoot/web/features/game/utils/constants";
import { translateServerMessage } from "@rahoot/web/features/game/utils/translateServerMessage";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";

type Props = PropsWithChildren & {
  statusName: Status | undefined;
  onNext?: () => void;
  manager?: boolean;
};

const GameWrapper = ({ children, statusName, onNext, manager }: Props) => {
  const { isConnected } = useSocket();
  const { player } = usePlayerStore();
  const { questionStates, setQuestionStates } = useQuestionStore();
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(false);

  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null;

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionStates({
      current,
      total,
    });
  });

  useEvent("game:errorMessage", (message) => {
    toast.error(translateServerMessage(message));
    setIsDisabled(false);
  });

  useEffect(() => {
    setIsDisabled(false);
  }, [statusName]);

  const handleNext = () => {
    setIsDisabled(true);
    onNext?.();
  };

  const getTranslatedNext = (text: string) => {
    switch (text) {
      case "Start Game":
        return t("game.startGame");
      case "Skip":
        return t("game.skip");
      case "Next":
        return t("game.next");
      default:
        return text;
    }
  };

  return (
    <section className="relative min-h-dvh flex">
      <div className="fixed top-0 left-0 h-full w-full">
        <img
          className="pointer-events-none h-full w-full object-cover"
          src={background}
          alt="background"
        />
      </div>

      <div className="z-10 flex flex-1 w-full flex-col justify-between">
        {!isConnected && !statusName ? (
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
            <Loader className="h-30" />
            <h1 className="text-4xl font-bold text-white">
              {t("common.loading")}
            </h1>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-between p-4">
              {questionStates && (
                <div className="shadow-inset flex items-center rounded-md bg-white p-2 px-4 text-lg font-bold text-black">
                  {t("game.of", {
                    current: questionStates.current,
                    total: questionStates.total,
                  })}
                </div>
              )}

              {manager && next && (
                <Button
                  className={clsx("self-end bg-white px-4 text-black!", {
                    "pointer-events-none": isDisabled,
                  })}
                  onClick={handleNext}
                >
                  {getTranslatedNext(next)}
                </Button>
              )}
            </div>

            {children}

            {!manager && (
              <div className="z-50 flex items-center justify-between bg-white px-4 py-2 text-lg font-bold text-white">
                <p className="text-gray-800 flex items-center gap-2">
                  {player?.avatar && (
                    <span className="text-xl">{player.avatar}</span>
                  )}
                  {player?.username}
                </p>
                <div className="rounded-sm bg-gray-800 px-3 py-1 text-lg">
                  {player?.points}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default GameWrapper;
