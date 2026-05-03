import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import et from '../locales/et.json';
import { setTMDBLanguage } from './tmdb';

export type LanguagePref = 'system' | 'en' | 'de' | 'es' | 'et';
export type SupportedLang = Exclude<LanguagePref, 'system'>;

const SUPPORTED: SupportedLang[] = ['en', 'de', 'es', 'et'];

const deviceCode = Localization.getLocales()[0]?.languageCode ?? 'en';
const deviceLang: SupportedLang = (SUPPORTED as string[]).includes(deviceCode)
  ? (deviceCode as SupportedLang)
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
    et: { translation: et },
  },
  lng: deviceLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

setTMDBLanguage(deviceLang);

export { i18n };

function countLeaves(obj: object): number {
  return Object.values(obj).reduce<number>(
    (sum, v) => sum + (v !== null && typeof v === 'object' ? countLeaves(v) : 1),
    0,
  );
}

const enTotal = countLeaves(en);
export const translationCoverage: Record<SupportedLang, number> = {
  en: 100,
  de: Math.round((countLeaves(de) / enTotal) * 100),
  es: Math.round((countLeaves(es) / enTotal) * 100),
  et: Math.round((countLeaves(et) / enTotal) * 100),
};

export function resolveLanguage(pref: LanguagePref): SupportedLang {
  if (pref === 'system') return deviceLang;
  return pref;
}

export function setAppLanguage(pref: LanguagePref) {
  const lang = resolveLanguage(pref);
  i18n.changeLanguage(lang);
  setTMDBLanguage(lang);
}
