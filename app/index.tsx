import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getStoredApiKey } from '@/lib/apiKey';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    getStoredApiKey().then((key) => {
      setHasKey(key.length > 0);
      setReady(true);
    });
  }, []);

  if (!ready) return <View style={{ flex: 1 }} />;
  return <Redirect href={hasKey ? '/home' : '/onboarding'} />;
}
