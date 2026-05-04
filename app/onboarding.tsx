import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { saveApiKey } from '@/lib/apiKey';
import { validateApiKey } from '@/lib/tmdb';

const TMDB_SIGNUP_URL = 'https://www.themoviedb.org/signup';
const TMDB_API_URL = 'https://www.themoviedb.org/settings/api';

type Step = 'intro' | 'enter-key';

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('intro');
  const [apiKey, setApiKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  async function handleSave() {
    if (!apiKey.trim()) { setError(t('onboarding.errorEmpty')); return; }
    setValidating(true);
    setError(null);
    const valid = await validateApiKey(apiKey);
    setValidating(false);
    if (!valid) {
      setError(t('onboarding.errorInvalid'));
      return;
    }
    await saveApiKey(apiKey);
    router.replace('/');
  }

  if (step === 'intro') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.logo, { color: colors.accent }]}>watcho</Text>
          <Text style={[styles.headline, { color: colors.text }]}>{t('onboarding.headline')}</Text>
          <Text style={[styles.body, { color: colors.textDim }]}>
            {t('onboarding.body')}
          </Text>

          <View style={[styles.stepsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {[
              { n: '1', text: t('onboarding.step1') },
              { n: '2', text: t('onboarding.step2') },
              { n: '3', text: t('onboarding.step3') },
            ].map((s) => (
              <View key={s.n} style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.accentDim }]}>
                  <Text style={[styles.stepNumberText, { color: colors.accent }]}>{s.n}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textDim }]}>{s.text}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={() => WebBrowser.openBrowserAsync(TMDB_SIGNUP_URL)}
          >
            <Ionicons name="globe-outline" size={16} color="#fff" />
            <Text style={styles.primaryButtonText}>{t('onboarding.createAccount')}</Text>
          </Pressable>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={() => WebBrowser.openBrowserAsync(TMDB_API_URL)}
          >
            <Ionicons name="key-outline" size={16} color="#fff" />
            <Text style={styles.primaryButtonText}>{t('onboarding.goToApi')}</Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => { setStep('enter-key'); setTimeout(() => inputRef.current?.focus(), 100); }}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>{t('onboarding.haveKey')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <Pressable style={styles.backRow} onPress={() => setStep('intro')}>
          <Ionicons name="chevron-back" size={18} color={colors.textDim} />
          <Text style={[styles.backText, { color: colors.textDim }]}>{t('onboarding.back')}</Text>
        </Pressable>

        <Text style={[styles.headline, { color: colors.text }]}>{t('onboarding.enterKey')}</Text>
        <Text style={[styles.body, { color: colors.textDim }]}>
          {t('onboarding.enterKeyBody')}
        </Text>

        <TextInput
          ref={inputRef}
          style={[styles.input, { backgroundColor: colors.surface, borderColor: error ? colors.accent : colors.border, color: colors.text }]}
          value={apiKey}
          onChangeText={(text) => { setApiKey(text); setError(null); }}
          placeholder={t('onboarding.keyPlaceholder')}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={15} color={colors.accent} />
            <Text style={[styles.errorText, { color: colors.accent }]}>{error}</Text>
          </View>
        )}

        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.accent, opacity: validating ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={validating}
        >
          {validating
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.primaryButtonText}>{t('onboarding.verifyContinue')}</Text>}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 14 },
  logo: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  headline: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  body: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  stepsCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumberText: { fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 13, lineHeight: 20 },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { paddingVertical: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '600' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  backText: { fontSize: 14 },
  input: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, letterSpacing: 0.3,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { fontSize: 13 },
});
