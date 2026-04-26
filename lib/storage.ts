import AsyncStorage from '@react-native-async-storage/async-storage';
import { MediaItem } from '@/types';

const WATCHLIST_KEY = 'watcho_watchlist_v1';

export async function loadWatchlist(): Promise<MediaItem[]> {
  try {
    const json = await AsyncStorage.getItem(WATCHLIST_KEY);
    return json ? (JSON.parse(json) as MediaItem[]) : [];
  } catch {
    return [];
  }
}

export async function persistWatchlist(items: MediaItem[]): Promise<void> {
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}
