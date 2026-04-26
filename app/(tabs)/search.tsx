import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { MediaCard } from '@/components/MediaCard';
import { SearchBar } from '@/components/SearchBar';
import { Colors } from '@/constants/Colors';
import { useSearch, useTrending } from '@/hooks/useTMDB';
import { TMDBSearchResult } from '@/types';

function TrendingSection() {
  const { results, loading } = useTrending();
  if (loading) return <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} />;
  return (
    <>
      <Text style={styles.sectionTitle}>Trending Today</Text>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        ListHeaderComponent={
          query.trim() === '' ? <TrendingSection /> : null
        }
        ListEmptyComponent={
          query.trim() && !loading
            ? <EmptyState icon="search-outline" title="No results" subtitle={`Nothing found for "${query}"`} />
            : loading
            ? <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} />
            : null
        }
        ListFooterComponent={error ? <Text style={styles.error}>{error}</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  gridItem: {
    flex: 1,
    maxWidth: '50%',
  },
  error: {
    color: Colors.accent,
    textAlign: 'center',
    padding: 16,
  },
});
