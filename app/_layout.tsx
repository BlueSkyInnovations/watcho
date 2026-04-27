import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { WatchlistProvider } from '@/context/WatchlistContext';

function AppStack() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="home" options={{ headerShown: false, title: 'Home' }} />
        <Stack.Screen name="movie/[id]" options={{ title: '', headerTransparent: true }} />
        <Stack.Screen name="tv/[id]" options={{ title: '', headerTransparent: true }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <AppStack />
      </WatchlistProvider>
    </ThemeProvider>
  );
}
