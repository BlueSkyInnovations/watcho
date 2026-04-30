import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/EmptyState';
import { MediaCard } from '@/components/MediaCard';
import { SearchBar } from '@/components/SearchBar';
import { useSearch, useTrending } from '@/hooks/useTMDB';
import { useColors } from '@/hooks/useColors';
import { TMDBSearchResult } from '@/types';

function TrendingSection() {
  const colors = useColors();
  const { t } = useTranslation();
  const { results, loading } = useTrending();
  if (loading) return <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />;
  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('search.trendingToday')}</Text>
      <FlatList<TMDBSearchResult>
        data={results}
        numColumns={2}
        keyExtractor={(item) => `${item.media_type}-${item.id}`}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <MediaCard item={item} style={styles.gridItem} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useSearch(query);
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.searchRow}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <FlatList<TMDBSearchResult>
        data={query.trim() ? results : []}
        numColumns={2}
        keyExtractor={(item) => `${item.media_type}-${item.id}`}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <MediaCard item={item} style={styles.gridItem} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={query.trim() === '' ? <TrendingSection /> : null}
        ListEmptyComponent={
          query.trim() && !loading
            ? <EmptyState icon="search-outline" title={t('search.noResults')} subtitle={t('search.nothingFound', { query })} />
            : loading
            ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
            : null
        }
        ListFooterComponent={error ? <Text style={[styles.error, { color: colors.accent }]}>{error}</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', paddingHorizontal: 6, paddingBottom: 10 },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
  gridItem: { flex: 1, maxWidth: '50%' },
  error: { textAlign: 'center', padding: 16 },
});
