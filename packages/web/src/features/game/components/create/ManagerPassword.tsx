import Button from "@rahoot/web/features/game/components/Button";
import Form from "@rahoot/web/features/game/components/Form";
import Input from "@rahoot/web/features/game/components/Input";
import { type KeyboardEvent, useState } from "react";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";

type Props = {
  onSubmit: (_password: string) => void;
};

const ManagerPassword = ({ onSubmit }: Props) => {
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const handleSubmit = () => {
    onSubmit(password);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Form>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("managerPassword.placeholder")}
      />
      <Button onClick={handleSubmit}>{t("managerPassword.submit")}</Button>
    </Form>
  );
};

export default ManagerPassword;
