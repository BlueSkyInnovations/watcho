import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY_STORAGE_KEY = 'watcho_tmdb_api_key';

export async function getStoredApiKey(): Promise<string> {
  return (await AsyncStorage.getItem(API_KEY_STORAGE_KEY)) ?? '';
}

export async function saveApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

export async function clearApiKey(): Promise<void> {
  await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
}
