import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

interface AppSettings {
  showWhereToWatch: boolean;
  showMoreLikeThis: boolean;
  showReview: boolean;
}

interface SettingsContextValue extends AppSettings {
  setShowWhereToWatch: (v: boolean) => void;
  setShowMoreLikeThis: (v: boolean) => void;
  setShowReview: (v: boolean) => void;
}

const STORAGE_KEY = 'watcho_settings';

const defaults: AppSettings = {
  showWhereToWatch: true,
  showMoreLikeThis: true,
  showReview: true,
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaults,
  setShowWhereToWatch: () => {},
  setShowMoreLikeThis: () => {},
  setShowReview: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaults);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) setSettings({ ...defaults, ...JSON.parse(json) });
    });
  }, []);

  function update(patch: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setShowWhereToWatch: (v) => update({ showWhereToWatch: v }),
      setShowMoreLikeThis: (v) => update({ showMoreLikeThis: v }),
      setShowReview: (v) => update({ showReview: v }),
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
