import Button from "@rahoot/web/features/game/components/Button";
import Form from "@rahoot/web/features/game/components/Form";
import Input from "@rahoot/web/features/game/components/Input";
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider";
import { usePlayerStore } from "@rahoot/web/features/game/stores/player";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";

const Room = () => {
  const { socket, isConnected } = useSocket();
  const { join } = usePlayerStore();
  const { t } = useTranslation();
  const [invitation, setInvitation] = useState("");
  const [searchParams] = useSearchParams();
  const hasJoinedRef = useRef(false);

  const handleJoin = () => {
    socket?.emit("player:join", invitation);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleJoin();
    }
  };

  useEvent("game:successRoom", (gameId) => {
    join(gameId);
  });

  useEffect(() => {
    const pinCode = searchParams.get("pin");

    if (!isConnected || !pinCode || hasJoinedRef.current) {
      return;
    }

    socket?.emit("player:join", pinCode);
    hasJoinedRef.current = true;
  }, [searchParams, isConnected, socket]);

  return (
    <Form>
      <Input
        onChange={(e) => setInvitation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("room.pinPlaceholder")}
      />
      <Button onClick={handleJoin}>{t("room.submit")}</Button>
    </Form>
  );
};

export default Room;
