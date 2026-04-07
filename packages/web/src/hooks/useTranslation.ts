import { create } from "zustand";

type Translations = Record<string, any>;

const localeCache: Record<string, Translations> = {};

const languageMap: Record<string, string> = {
  fr: "fr",
  en: "en",
  es: "es",
  it: "it",
  de: "de",
};

const defaultLanguage = "en";

async function loadLocale(lang: string): Promise<Translations> {
  if (localeCache[lang]) {
    return localeCache[lang];
  }

  try {
    const response = await import(`../locales/${lang}.json`);
    localeCache[lang] = response.default || response;
    return localeCache[lang];
  } catch (error) {
    console.error(`Failed to load locale "${lang}":`, error);
    if (lang !== defaultLanguage) {
      return loadLocale(defaultLanguage);
    }
    return {};
  }
}

type LanguageState = {
  locale: string;
  translations: Translations;
  isLoading: boolean;
  _initialized: boolean;
};

type LanguageStore = LanguageState & {
  init: () => Promise<void>;
  changeLanguage: (_lang: string) => Promise<void>;
  t: (_key: string, _params?: Record<string, string | number>) => string;
};

/**
 * Resolve a dotted key like "game.questionNumber" from a nested object.
 */
function resolveKey(
  obj: any,
  keys: string[],
): string | undefined {
  let value: any = obj;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  return typeof value === "string" ? value : undefined;
}

/**
 * Replace {placeholders} in a translated string.
 * E.g. "Question #{number}" + { number: 3 } → "Question #3"
 * Also supports "{current} sur {total}" style.
 */
function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in params ? String(params[key]) : `{${key}}`,
  );
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  locale: defaultLanguage,
  translations: {},
  isLoading: true,
  _initialized: false,

  init: async () => {
    if (get()._initialized) return;

    const browserLang =
      navigator.language || navigator.languages?.[0] || "en";
    const shortLang = browserLang.split("-")[0].toLowerCase();
    const detectedLang = languageMap[shortLang] || defaultLanguage;

    const trans = await loadLocale(detectedLang);
    set({
      locale: detectedLang,
      translations: trans,
      isLoading: false,
      _initialized: true,
    });
  },

  changeLanguage: async (lang: string) => {
    const newLang = languageMap[lang] || defaultLanguage;
    set({ isLoading: true });
    const trans = await loadLocale(newLang);
    set({ locale: newLang, translations: trans, isLoading: false });
  },

  t: (key: string, params?: Record<string, string | number>): string => {
    if (!key) return key;

    const { translations, locale } = get();
    const keys = key.split(".");

    // Try current locale
    const value = resolveKey(translations, keys);
    if (value !== undefined) {
      return interpolate(value, params);
    }

    // Fallback to default language
    if (locale !== defaultLanguage && localeCache[defaultLanguage]) {
      const fallback = resolveKey(localeCache[defaultLanguage], keys);
      if (fallback !== undefined) {
        return interpolate(fallback, params);
      }
    }

    return key;
  },
}));

/**
 * Convenience hook – same API as before, but global state.
 */
export function useTranslation() {
  const { t, locale, changeLanguage, isLoading, init } = useLanguageStore();

  if (!useLanguageStore.getState()._initialized) {
    init();
  }

  return { t, locale, changeLanguage, isLoading };
}
