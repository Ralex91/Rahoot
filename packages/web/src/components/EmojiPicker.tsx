import Image from "next/image"

type Props = {
  selectedEmoji: string | null
  onSelect: (emoji: string) => void
}

// Füge hier weitere Emoji-IDs hinzu, sobald die entsprechenden SVG-Dateien vorhanden sind
const EMOJIS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]

const EmojiPicker = ({ selectedEmoji, onSelect }: Props) => {
  return (
    <div className="w-full">
      <p className="mb-3 text-center text-sm font-semibold text-white drop-shadow-md">
        Choose your emoji
      </p>
      <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto p-2 rounded-lg bg-black/10">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className={`relative transition-all duration-200 hover:scale-110 ${
              selectedEmoji === emoji
                ? "scale-110 rounded-lg bg-gradient-to-br from-white/40 to-white/20 p-1 ring-4 ring-white shadow-lg shadow-white/50"
                : "rounded-lg p-1 hover:bg-white/10"
            }`}
          >
            {selectedEmoji === emoji && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
            <Image
              src={`/${emoji}.svg`}
              alt={`Emoji ${emoji}`}
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default EmojiPicker
