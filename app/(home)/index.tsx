import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/EmptyState';
import { MediaCard } from '@/components/MediaCard';
import { MediaListItem } from '@/components/MediaListItem';
import { SortSheet } from '@/components/SortSheet';
import { StatusColors } from '@/constants/Colors';
import { useWatchlist } from '@/context/WatchlistContext';
import { useColors } from '@/hooks/useColors';
import { MediaItem, SortOrder, WatchStatus } from '@/types';

const TABS: WatchStatus[] = ['watchlist', 'watching', 'watched'];
const PREFS_KEY = 'watcho_tab_prefs';

type ViewMode = 'grid' | 'list';
type TabPrefs = { sort: SortOrder; view: ViewMode };
type AllTabPrefs = Record<WatchStatus, TabPrefs>;
const DEFAULT_PREFS: AllTabPrefs = {
  watchlist: { sort: 'added_at', view: 'grid' },
  watching:  { sort: 'added_at', view: 'grid' },
  watched:   { sort: 'added_at', view: 'grid' },
};

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<WatchStatus>('watchlist');
  const [tabPrefs, setTabPrefs] = useState<AllTabPrefs>(DEFAULT_PREFS);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        const merged = { ...DEFAULT_PREFS };
        for (const tab of TABS) {
          if (saved[tab]) merged[tab] = { ...DEFAULT_PREFS[tab], ...saved[tab] };
        }
        setTabPrefs(merged);
      } catch {}
    });
  }, []);

  function savePrefs(next: AllTabPrefs) {
    setTabPrefs(next);
    AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
  }

  function setSort(order: SortOrder) {
    savePrefs({ ...tabPrefs, [activeTab]: { ...tabPrefs[activeTab], sort: order } });
  }

  function toggleViewMode() {
    const next: ViewMode = tabPrefs[activeTab].view === 'grid' ? 'list' : 'grid';
    savePrefs({ ...tabPrefs, [activeTab]: { ...tabPrefs[activeTab], view: next } });
  }

  const emptyConfig = {
    watchlist: { icon: 'bookmark-outline' as const, title: t('myLists.empty.watchlist.title'), subtitle: t('myLists.empty.watchlist.subtitle') },
    watching:  { icon: 'play-circle-outline' as const, title: t('myLists.empty.watching.title'), subtitle: t('myLists.empty.watching.subtitle') },
    watched:   { icon: 'checkmark-circle-outline' as const, title: t('myLists.empty.watched.title'), subtitle: t('myLists.empty.watched.subtitle') },
  };

  const currentPrefs = tabPrefs[activeTab];
  const currentSort = currentPrefs.sort;
  const isGrid = currentPrefs.view === 'grid';
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
                {t(`status.${tab}`)}
              </Text>
              {count > 0 && (
                <View style={[styles.count, { backgroundColor: active ? StatusColors[tab] : colors.surfaceHighlight }]}>
                  <Text style={styles.countText}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        <View style={styles.actions}>
          <Pressable onPress={toggleViewMode} hitSlop={8} style={styles.actionButton}>
            <Ionicons
              name={isGrid ? 'list-outline' : 'grid-outline'}
              size={20}
              color={colors.textDim}
            />
          </Pressable>
          <Pressable onPress={() => setSheetVisible(true)} hitSlop={8} style={styles.actionButton}>
            <Ionicons name="swap-vertical-outline" size={20} color={colors.textDim} />
          </Pressable>
        </View>
      </View>

      <FlatList<MediaItem>
        key={String(isGrid)}
        data={filtered}
        numColumns={isGrid ? 2 : 1}
        keyExtractor={(item) => `${item.mediaType}-${item.id}`}
        contentContainerStyle={isGrid ? styles.grid : styles.listContent}
        renderItem={({ item }) =>
          isGrid
            ? <MediaCard item={item} style={styles.gridItem} />
            : <MediaListItem item={item} />
        }
        ListEmptyComponent={<EmptyState {...emptyConfig[activeTab]} />}
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  count: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionButton: { paddingVertical: 12, paddingHorizontal: 6 },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
  gridItem: { flex: 1, maxWidth: '50%' },
  listContent: { paddingBottom: 20 },
});
