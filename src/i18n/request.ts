import { getRequestConfig } from 'next-intl/server';
import { routing } from "./routing";
import deepMerge from '../utils/deepMerge';

export default getRequestConfig(async ({ requestLocale }) => {

  let locale = await requestLocale;


  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages;

  try {
    const localeJson = (await import(`../assets/translations/${locale}.json`)).default;

    if (locale === routing.defaultLocale) {
      messages = localeJson;
    } else {
      const defaultLocaleJson = (await import(`../assets/translations/${routing.defaultLocale}.json`)).default;
      messages = deepMerge(structuredClone(defaultLocaleJson), localeJson);
    }
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error);
    const defaultLocaleJson = (await import(`../assets/translations/${routing.defaultLocale}.json`)).default;
    messages = defaultLocaleJson;
  }

  return {
    locale, 
    messages
  };
});
