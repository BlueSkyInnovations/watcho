import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/context/SettingsContext';
import { ThemePreference, useTheme } from '@/context/ThemeContext';
import { useColors } from '@/hooks/useColors';
import { translationCoverage, type LanguagePref, type SupportedLang } from '@/lib/i18n';
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
  { value: 'es', labelKey: 'settings.langSpanish' },
];

interface LanguageSheetProps {
  visible: boolean;
  value: LanguagePref;
  onChange: (v: LanguagePref) => void;
  onClose: () => void;
}

function LanguageSheet({ visible, value, onChange, onClose }: LanguageSheetProps) {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={sheetStyles.overlay} onPress={onClose}>
        <Pressable style={[sheetStyles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[sheetStyles.handle, { backgroundColor: colors.border }]} />
          <Text style={[sheetStyles.title, { color: colors.textDim }]}>{t('settings.appLanguage')}</Text>
          {LANG_OPTIONS.map((opt, index) => {
            const active = value === opt.value;
            const pct = opt.value !== 'system' ? translationCoverage[opt.value as SupportedLang] : null;
            return (
              <Pressable
                key={opt.value}
                style={[
                  sheetStyles.row,
                  index < LANG_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  active && { backgroundColor: colors.accentDim },
                ]}
                onPress={() => { onChange(opt.value); onClose(); }}
              >
                <Text style={[sheetStyles.label, { color: active ? colors.accent : colors.text }]}>
                  {t(opt.labelKey)}
                </Text>
                {pct !== null && pct < 100 && (
                  <Text style={[sheetStyles.pct, { color: colors.textMuted }]}>{pct}%</Text>
                )}
                {active && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
              </Pressable>
            );
          })}
          <View style={[sheetStyles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            style={sheetStyles.weblateRow}
            onPress={() => Linking.openURL('https://hosted.weblate.org/engage/watcho/')}
          >
            <Ionicons name="earth-outline" size={15} color={colors.textMuted} />
            <Text style={[sheetStyles.weblateLabel, { color: colors.textMuted }]}>{t('settings.helpTranslate')}</Text>
            <Ionicons name="open-outline" size={13} color={colors.textMuted} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function AboutSection() {
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <>
      <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 28 }]}>
        {t('settings.aboutSection')}
      </Text>
      <View style={[aboutStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>

        {/* ── Blue Sky Innovations copyright ────────────────── */}
        <View style={aboutStyles.block}>
          <View style={aboutStyles.logoBubble}>
            <Image
              source={require('../assets/logos/BlueSky_194x50_Transparent_Background.png')}
              style={aboutStyles.blueskyImg}
              resizeMode="contain"
            />
          </View>
          <Text style={[aboutStyles.copyText, { color: colors.textMuted }]}>
            © 2026 Blue Sky Innovations GmbH
          </Text>
        </View>

        <View style={[aboutStyles.rule, { backgroundColor: colors.border }]} />

        {/* ── TMDB attribution ─────────────────────────────── */}
        <Pressable
          style={aboutStyles.block}
          onPress={() => Linking.openURL('https://www.themoviedb.org')}
        >
          <Text style={[aboutStyles.blockLabel, { color: colors.textDim }]}>
            {t('settings.aboutTmdb')}
          </Text>
          <LinearGradient
            colors={['#90CEA1', '#3CBEC9', '#01B4E4']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={aboutStyles.tmdbBadge}
          >
            <Text style={aboutStyles.tmdbWord}>TMDB</Text>
          </LinearGradient>
          <Text style={[aboutStyles.legalText, { color: colors.textMuted }]}>
            {t('settings.aboutTmdbDisclaimer')}
          </Text>
        </Pressable>

        <View style={[aboutStyles.rule, { backgroundColor: colors.border }]} />

        {/* ── YouTube attribution ───────────────────────────── */}
        <Pressable
          style={aboutStyles.block}
          onPress={() => Linking.openURL('https://www.youtube.com')}
        >
          <Text style={[aboutStyles.blockLabel, { color: colors.textDim }]}>
            {t('settings.aboutYoutube')}
          </Text>
          <View style={aboutStyles.ytRow}>
            <Image
              source={require('../assets/logos/youtube_icon.png')}
              style={aboutStyles.ytIcon}
              resizeMode="contain"
            />
            <Text style={aboutStyles.ytWord}>YouTube</Text>
          </View>
          <Text style={[aboutStyles.legalText, { color: colors.textMuted }]}>
            {t('settings.aboutYoutubeDisclaimer')}
          </Text>
        </Pressable>

      </View>
    </>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const {
    showWhereToWatch, setShowWhereToWatch,
    showMoreLikeThis, setShowMoreLikeThis,
    showReview, setShowReview,
    showEpisodeGuide, setShowEpisodeGuide,
    language, setLanguage,
  } = useSettings();
  const router = useRouter();
  const [keyPreview, setKeyPreview] = useState('');
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const currentLangLabel = t(LANG_OPTIONS.find((o) => o.value === language)?.labelKey ?? 'settings.langSystem');

  useEffect(() => {
    getStoredApiKey().then((k) => {
      setKeyPreview(k ? `${k.slice(0, 6)}••••••••••••••••` : t('settings.notSet'));
    });
  }, []);

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
        {/* Appearance */}
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

        {/* Detail screens */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 28 }]}>{t('settings.detailScreens')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="tv-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.whereToWatch')}</Text>
            <Switch value={showWhereToWatch} onValueChange={setShowWhereToWatch} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
          </View>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="albums-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.moreLikeThis')}</Text>
            <Switch value={showMoreLikeThis} onValueChange={setShowMoreLikeThis} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
          </View>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="create-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.personalReview')}</Text>
            <Switch value={showReview} onValueChange={setShowReview} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
          </View>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="list-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.episodeGuide')}</Text>
            <Switch value={showEpisodeGuide} onValueChange={setShowEpisodeGuide} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
          </View>
        </View>

        {/* TMDB API */}
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
          <Pressable style={styles.row} onPress={() => router.push('/onboarding')}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="pencil-outline" size={18} color={colors.textDim} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.changeKey')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]} onPress={handleRemoveKey}>
            <View style={[styles.iconWrap, { backgroundColor: colors.accentDim }]}>
              <Ionicons name="trash-outline" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.accent }]}>{t('settings.removeKey')}</Text>
          </Pressable>
        </View>

        <Text style={[styles.hint, { color: colors.textMuted }]}>{t('settings.hint')}</Text>

        {/* Language — at the bottom, rarely changed */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 28 }]}>{t('settings.language')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable style={styles.row} onPress={() => setLangSheetVisible(true)}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="language-outline" size={18} color={colors.textDim} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.appLanguage')}</Text>
              <Text style={[styles.rowSub, { color: colors.textMuted }]}>{currentLangLabel}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
        </View>

        <AboutSection />

      </ScrollView>

      <LanguageSheet
        visible={langSheetVisible}
        value={language}
        onChange={setLanguage}
        onClose={() => setLangSheetVisible(false)}
      />
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

const aboutStyles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  block: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24, gap: 12 },
  rule: { height: StyleSheet.hairlineWidth },
  logoBubble: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  blueskyImg: { width: 136, height: 35 },
  copyText: { fontSize: 12, letterSpacing: 0.1 },
  blockLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  tmdbBadge: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 10 },
  tmdbWord: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  legalText: { fontSize: 11, textAlign: 'center', lineHeight: 16, maxWidth: 270 },
  ytRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ytIcon: { width: 42, height: 30 },
  ytWord: { fontSize: 24, fontWeight: '700', color: '#FF0000', letterSpacing: -0.5 },
});

const sheetStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderWidth: 1, borderBottomWidth: 0,
    paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10,
  },
  label: { flex: 1, fontSize: 16, fontWeight: '500' },
  pct: { fontSize: 12, marginRight: 4 },
  divider: { height: 1, marginHorizontal: 12, marginTop: 8 },
  weblateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 12 },
  weblateLabel: { flex: 1, fontSize: 13 },
});
