import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { type LanguagePref, setAppLanguage } from '@/lib/i18n';

interface AppSettings {
  showWhereToWatch: boolean;
  showMoreLikeThis: boolean;
  showReview: boolean;
  showEpisodeGuide: boolean;
  language: LanguagePref;
}

interface SettingsContextValue extends AppSettings {
  setShowWhereToWatch: (v: boolean) => void;
  setShowMoreLikeThis: (v: boolean) => void;
  setShowReview: (v: boolean) => void;
  setShowEpisodeGuide: (v: boolean) => void;
  setLanguage: (v: LanguagePref) => void;
}

const STORAGE_KEY = 'watcho_settings';

const defaults: AppSettings = {
  showWhereToWatch: true,
  showMoreLikeThis: true,
  showReview: true,
  showEpisodeGuide: true,
  language: 'system',
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaults,
  setShowWhereToWatch: () => {},
  setShowMoreLikeThis: () => {},
  setShowReview: () => {},
  setShowEpisodeGuide: () => {},
  setLanguage: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaults);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        const saved = { ...defaults, ...JSON.parse(json) };
        setSettings(saved);
        setAppLanguage(saved.language);
      }
    });
  }, []);

  function update(patch: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (patch.language !== undefined) setAppLanguage(next.language);
      return next;
    });
  }

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setShowWhereToWatch: (v) => update({ showWhereToWatch: v }),
      setShowMoreLikeThis: (v) => update({ showMoreLikeThis: v }),
      setShowReview: (v) => update({ showReview: v }),
      setShowEpisodeGuide: (v) => update({ showEpisodeGuide: v }),
      setLanguage: (v) => update({ language: v }),
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
