import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import { setTMDBLanguage } from './tmdb';

export type LanguagePref = 'system' | 'en' | 'de' | 'es';

const SUPPORTED = ['en', 'de'] as const;
type SupportedLang = (typeof SUPPORTED)[number];

const deviceCode = Localization.getLocales()[0]?.languageCode ?? 'en';
const deviceLang: SupportedLang = (SUPPORTED as readonly string[]).includes(deviceCode)
  ? (deviceCode as SupportedLang)
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
  },
  lng: deviceLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

setTMDBLanguage(deviceLang);

export { i18n };

export function resolveLanguage(pref: LanguagePref): SupportedLang {
  if (pref === 'system') return deviceLang;
  return pref;
}

export function setAppLanguage(pref: LanguagePref) {
  const lang = resolveLanguage(pref);
  i18n.changeLanguage(lang);
  setTMDBLanguage(lang);
}
