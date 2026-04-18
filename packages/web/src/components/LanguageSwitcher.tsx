import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

const LANGUAGES = [
  { code: "en", label: "common:language.en" },
  { code: "fr", label: "common:language.fr" },
]

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation()

  return (
    <div className="relative flex items-center">
      <Globe className="pointer-events-none absolute left-2.5 mt-0.5 size-4 text-gray-700" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="cursor-pointer appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pl-8 text-sm font-semibold text-gray-600 hover:border-gray-300"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {t(l.label)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
