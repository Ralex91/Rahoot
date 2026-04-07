import clsx from "clsx";
import { useEffect, useState } from "react";

type Props = {
  onSelect: (avatar: string) => void;
  selectedAvatar?: string;
  disabled?: boolean;
};

const AVATARS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "😉",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
];

const AvatarSelector = ({
  onSelect,
  selectedAvatar,
  disabled = false,
}: Props) => {
  const [selected, setSelected] = useState<string>(selectedAvatar || "");

  useEffect(() => {
    if (selectedAvatar) {
      setSelected(selectedAvatar);
    }
  }, [selectedAvatar]);

  const handleSelect = (avatar: string) => {
    if (disabled) return;

    const newSelection = selected === avatar ? "" : avatar;
    setSelected(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="w-full overflow-y-auto p-2" style={{ maxHeight: "280px" }}>
      <div className="flex flex-wrap gap-2 justify-center">
        {AVATARS.map((avatar) => (
          <button
            key={avatar}
            type="button"
            className={clsx(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-lg transition-all",
              "border border-gray-300 bg-white hover:border-primary hover:bg-primary/10",
              selected === avatar &&
                "border-primary bg-primary/20 shadow-md ring-2 ring-primary/40",
              disabled && "cursor-not-allowed opacity-50",
            )}
            onClick={() => handleSelect(avatar)}
            disabled={disabled}
          >
            {avatar}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
