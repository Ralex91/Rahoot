import type { PlayerStatusDataMap } from "@rahoot/common/types/game/status";
import Loader from "@rahoot/web/features/game/components/Loader";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";

type Props = {
  data: PlayerStatusDataMap["WAIT"];
};

/**
 * Map server-sent English text to i18n keys.
 * The server sends hardcoded English strings; we translate client-side.
 */
const textToKey: Record<string, string> = {
  "Waiting for players": "wait.waitingPlayers",
  "Waiting for the players": "wait.waitingPlayers",
  "Waiting for the players to answer": "wait.waitingAnswers",
};

const Wait = ({ data: { text } }: Props) => {
  const { t } = useTranslation();

  const translatedText = textToKey[text] ? t(textToKey[text]) : text;

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <Loader className="h-30" />
      <h2 className="mt-5 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        {translatedText}
      </h2>
    </section>
  );
};

export default Wait;
