import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { MediaCard } from '@/components/MediaCard';
import { SortSheet } from '@/components/SortSheet';
import { StatusColors, StatusLabels } from '@/constants/Colors';
import { useWatchlist } from '@/context/WatchlistContext';
import { useColors } from '@/hooks/useColors';
import { MediaItem, SortOrder, WatchStatus } from '@/types';

const TABS: WatchStatus[] = ['watchlist', 'watching', 'watched'];
const SORT_PREFS_KEY = 'watcho_sort_prefs';

const EMPTY_CONFIG = {
  watchlist: { icon: 'bookmark-outline' as const, title: 'Your watchlist is empty', subtitle: 'Search for movies or TV shows and add them to your list.' },
  watching: { icon: 'play-circle-outline' as const, title: "You're not watching anything", subtitle: 'Mark something as "Watching" to track your progress here.' },
  watched: { icon: 'checkmark-circle-outline' as const, title: 'No titles watched yet', subtitle: 'After you watch something, mark it as Watched to see it here.' },
};

type SortPrefs = Record<WatchStatus, SortOrder>;
const DEFAULT_SORT: SortPrefs = { watchlist: 'added_at', watching: 'added_at', watched: 'added_at' };

function sortItems(items: MediaItem[], order: SortOrder): MediaItem[] {
  return [...items].sort((a, b) => {
    if (order === 'release_date') {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    }
    if (order === 'updated_at') {
      return new Date(b.updatedAt ?? b.addedAt).getTime() - new Date(a.updatedAt ?? a.addedAt).getTime();
    }
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });
}

export default function MyListsScreen() {
  const { items } = useWatchlist();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<WatchStatus>('watchlist');
  const [sortPrefs, setSortPrefs] = useState<SortPrefs>(DEFAULT_SORT);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SORT_PREFS_KEY).then((val) => {
      if (val) setSortPrefs({ ...DEFAULT_SORT, ...JSON.parse(val) });
    });
  }, []);

  function setSort(order: SortOrder) {
    const next = { ...sortPrefs, [activeTab]: order };
    setSortPrefs(next);
    AsyncStorage.setItem(SORT_PREFS_KEY, JSON.stringify(next));
  }

  const currentSort = sortPrefs[activeTab];
  const filtered = sortItems(items.filter((i) => i.status === activeTab), currentSort);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.accent }]}>watcho</Text>
      </View>

      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        {TABS.map((tab) => {
          const count = items.filter((i) => i.status === tab).length;
          const active = tab === activeTab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, active && { borderBottomColor: StatusColors[tab] }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabLabel, { color: active ? colors.text : colors.textMuted }]}>
                {StatusLabels[tab]}
              </Text>
              {count > 0 && (
                <View style={[styles.count, { backgroundColor: active ? StatusColors[tab] : colors.surfaceHighlight }]}>
                  <Text style={styles.countText}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        <Pressable style={styles.sortButton} onPress={() => setSheetVisible(true)} hitSlop={8}>
          <Ionicons name="swap-vertical-outline" size={20} color={colors.textDim} />
        </Pressable>
      </View>

      <FlatList<MediaItem>
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => `${item.mediaType}-${item.id}`}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <MediaCard item={item} style={styles.gridItem} />
        )}
        ListEmptyComponent={<EmptyState {...EMPTY_CONFIG[activeTab]} />}
        showsVerticalScrollIndicator={false}
      />

      <SortSheet
        visible={sheetVisible}
        value={currentSort}
        onChange={setSort}
        onClose={() => setSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  logo: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: { fontSize: 13, fontWeight: '600' },
  count: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  sortButton: { paddingVertical: 12, paddingLeft: 8 },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
  gridItem: { flex: 1, maxWidth: '50%' },
});
