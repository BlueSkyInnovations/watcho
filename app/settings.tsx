import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/context/SettingsContext';
import { ThemePreference, useTheme } from '@/context/ThemeContext';
import { useColors } from '@/hooks/useColors';
import { type LanguagePref } from '@/lib/i18n';
import { clearApiKey, getStoredApiKey } from '@/lib/apiKey';

interface ThemeOption {
  value: ThemePreference;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', labelKey: 'settings.light', icon: 'sunny' },
  { value: 'dark', labelKey: 'settings.dark', icon: 'moon' },
  { value: 'system', labelKey: 'settings.deviceSetting', icon: 'contrast-outline' },
];

interface LangOption {
  value: LanguagePref;
  labelKey: string;
}

const LANG_OPTIONS: LangOption[] = [
  { value: 'system', labelKey: 'settings.langSystem' },
  { value: 'en', labelKey: 'settings.langEnglish' },
  { value: 'de', labelKey: 'settings.langGerman' },
];

export default function SettingsScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const {
    showWhereToWatch, setShowWhereToWatch,
    showMoreLikeThis, setShowMoreLikeThis,
    showReview, setShowReview,
    language, setLanguage,
  } = useSettings();
  const router = useRouter();
  const [keyPreview, setKeyPreview] = useState('');

  useEffect(() => {
    getStoredApiKey().then((k) => {
      setKeyPreview(k ? `${k.slice(0, 6)}••••••••••••••••` : t('settings.notSet'));
    });
  }, []);

  function handleChangeKey() {
    router.push('/onboarding');
  }

  function handleRemoveKey() {
    Alert.alert(
      t('settings.removeAlert.title'),
      t('settings.removeAlert.message'),
      [
        { text: t('settings.removeAlert.cancel'), style: 'cancel' },
        {
          text: t('settings.removeAlert.remove'), style: 'destructive',
          onPress: async () => {
            await clearApiKey();
            router.replace('/onboarding');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: t('settings.title'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settings.appearance')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {THEME_OPTIONS.map((opt, index) => {
            const active = preference === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[styles.row, index < THEME_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                onPress={() => setPreference(opt.value)}
              >
                <View style={[styles.iconWrap, { backgroundColor: active ? colors.accentDim : colors.surfaceHighlight }]}>
                  <Ionicons name={opt.icon} size={18} color={active ? colors.accent : colors.textDim} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{t(opt.labelKey)}</Text>
                {active && <Ionicons name="checkmark" size={20} color={colors.accent} />}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 28 }]}>{t('settings.language')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {LANG_OPTIONS.map((opt, index) => {
            const active = language === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[styles.row, index < LANG_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                onPress={() => setLanguage(opt.value)}
              >
                <View style={[styles.iconWrap, { backgroundColor: active ? colors.accentDim : colors.surfaceHighlight }]}>
                  <Ionicons name="language-outline" size={18} color={active ? colors.accent : colors.textDim} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{t(opt.labelKey)}</Text>
                {active && <Ionicons name="checkmark" size={20} color={colors.accent} />}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 28 }]}>{t('settings.detailScreens')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="tv-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.whereToWatch')}</Text>
            <Switch
              value={showWhereToWatch}
              onValueChange={setShowWhereToWatch}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="albums-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.moreLikeThis')}</Text>
            <Switch
              value={showMoreLikeThis}
              onValueChange={setShowMoreLikeThis}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="create-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.personalReview')}</Text>
            <Switch
              value={showReview}
              onValueChange={setShowReview}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 28 }]}>{t('settings.tmdbApi')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="key-outline" size={18} color={colors.textDim} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.apiKey')}</Text>
              <Text style={[styles.rowSub, { color: colors.textMuted }]}>{keyPreview}</Text>
            </View>
          </View>
          <Pressable style={styles.row} onPress={handleChangeKey}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="pencil-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.changeKey')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable
            style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]}
            onPress={handleRemoveKey}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.accentDim }]}>
              <Ionicons name="trash-outline" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.accent }]}>{t('settings.removeKey')}</Text>
          </Pressable>
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {t('settings.hint')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  iconWrap: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  rowSub: { fontSize: 12, marginTop: 1 },
  hint: { fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 16 },
});
