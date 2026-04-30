import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Toast } from '@/components/Toast';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { useQuickActions } from '@/hooks/useQuickActions';

function AppStack() {
  const { colors, isDark } = useTheme();
  const { toast, clearToast } = useQuickActions();
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
        <Stack.Screen name="settings" options={{ title: 'Settings',headerShown: true }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast message={toast} onHide={clearToast} />
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
