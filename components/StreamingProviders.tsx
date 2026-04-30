import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { LOGO_URL } from '@/lib/tmdb';
import type { WatchProvider, WatchProviders } from '@/types';

interface Props {
  providers: WatchProviders;
  region: string;
}

function ProviderRow({ label, items }: { label: string; items: WatchProvider[] }) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <Text style={[styles.categoryLabel, { color: colors.textMuted }]}>{label}</Text>
      <View style={styles.logos}>
        {items.slice(0, 10).map((p) => (
          <Image
            key={p.provider_id}
            source={{ uri: LOGO_URL(p.logo_path) }}
            style={styles.logo}
            accessibilityLabel={p.provider_name}
          />
        ))}
      </View>
    </View>
  );
}

export function StreamingProviders({ providers, region }: Props) {
  const colors = useColors();
  const { t } = useTranslation();
  const hasContent =
    (providers.flatrate?.length ?? 0) > 0 ||
    (providers.rent?.length ?? 0) > 0 ||
    (providers.buy?.length ?? 0) > 0;

  if (!hasContent) return null;

  function openLink() {
    if (providers.link) Linking.openURL(providers.link);
  }

  return (
    <Pressable onPress={openLink} style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {(providers.flatrate?.length ?? 0) > 0 && (
        <ProviderRow label={t('providers.stream')} items={providers.flatrate!} />
      )}
      {(providers.rent?.length ?? 0) > 0 && (
        <ProviderRow label={t('providers.rent')} items={providers.rent!} />
      )}
      {(providers.buy?.length ?? 0) > 0 && (
        <ProviderRow label={t('providers.buy')} items={providers.buy!} />
      )}
      <Text style={[styles.attribution, { color: colors.textMuted }]}>
        {t('providers.attribution', { region })}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  row: {
    gap: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  logos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  attribution: {
    fontSize: 11,
    marginTop: 2,
  },
});
