import { getRequestConfig } from 'next-intl/server';
import { routing } from "./routing";
import deepMerge from "@/utils/deepMerge";

async function loadLocaleJson(locale: string) {
  try {
    return (await import(`../resource/generated/translations/${locale}.json`)).default;
  } catch {
    return null;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = (!requestedLocale || !routing.locales.includes(requestedLocale as any))
    ? routing.defaultLocale
    : requestedLocale;

  const defaultJson = await loadLocaleJson(routing.defaultLocale);
  const localeJson = locale === routing.defaultLocale
    ? defaultJson
    : (await loadLocaleJson(locale)) ?? defaultJson;

  const messages = locale === routing.defaultLocale
    ? defaultJson
    : deepMerge(structuredClone(defaultJson), localeJson);

  return { locale, messages };
});
