import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { getStoredApiKey } from '@/lib/apiKey';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    getStoredApiKey().then((key) => {
      router.replace(key.length > 0 ? '/(home)' : '/onboarding');
    });
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#0D0D14' }} />;
}
