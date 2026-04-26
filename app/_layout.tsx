import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WatchlistProvider } from '@/context/WatchlistContext';

export default function RootLayout() {
  return (
    <WatchlistProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0D0D14' },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#0D0D14' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ title: '', headerTransparent: true }} />
        <Stack.Screen name="tv/[id]" options={{ title: '', headerTransparent: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </WatchlistProvider>
  );
}
