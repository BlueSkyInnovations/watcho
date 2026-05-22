import '@/lib/i18n';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Toast } from '@/components/Toast';
import { ImportModal } from '@/components/ImportModal';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { WatchlistProvider, useWatchlist } from '@/context/WatchlistContext';
import { useQuickActions } from '@/hooks/useQuickActions';
import { readBackupFile, mergeWatchlists, type BackupFile, type MergeStrategy } from '@/lib/backup';

function AppStack() {
  const { colors, isDark } = useTheme();
  const { items, replaceItems } = useWatchlist();
  const { toast, clearToast } = useQuickActions();
  const { t } = useTranslation();
  const [pendingBackup, setPendingBackup] = useState<BackupFile | null>(null);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleFileUrl(url);
    });
    const sub = Linking.addEventListener('url', ({ url }) => handleFileUrl(url));
    return () => sub.remove();
  }, []);

  async function handleFileUrl(url: string) {
    if (url.startsWith('watcho://import')) {
      setPendingBackup({ version: 1, exportedAt: new Date().toISOString(), watchlist: [] });
      return;
    }
    if (!url.startsWith('file://')) return;
    try {
      const backup = await readBackupFile(url);
      setPendingBackup(backup);
    } catch {
      Alert.alert(t('settings.data.invalidFile'));
    }
  }

  function handleImportConfirm(strategy: MergeStrategy) {
    if (!pendingBackup) return;
    const merged = mergeWatchlists(items, pendingBackup.watchlist, strategy);
    replaceItems(merged);
    setPendingBackup(null);
    Alert.alert(t('settings.data.importSuccess', { count: merged.length }));
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(home)" options={{ headerShown: false, title: 'Home' }} />
        <Stack.Screen name="movie/[id]" options={{ title: '', headerTransparent: true,headerShown: true}} />
        <Stack.Screen name="tv/[id]" options={{ title: '', headerTransparent: true, headerShown: true}} />
        <Stack.Screen name="settings" options={{ title: t('settings.title'), headerShown: true }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast message={toast} onHide={clearToast} />
      {pendingBackup && (
        <ImportModal
          backup={pendingBackup}
          existingCount={items.length}
          onConfirm={handleImportConfirm}
          onClose={() => setPendingBackup(null)}
        />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <SettingsProvider>
          <AppStack />
        </SettingsProvider>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
