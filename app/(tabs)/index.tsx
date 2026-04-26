import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { MediaCard } from '@/components/MediaCard';
import { Colors, StatusColors, StatusLabels } from '@/constants/Colors';
import { useWatchlist } from '@/context/WatchlistContext';
import { MediaItem, WatchStatus } from '@/types';

const TABS: WatchStatus[] = ['watchlist', 'watching', 'watched'];

const EMPTY_CONFIG = {
  watchlist: { icon: 'bookmark-outline' as const, title: 'Your watchlist is empty', subtitle: 'Search for movies or TV shows and add them to your list.' },
  watching: { icon: 'play-circle-outline' as const, title: "You're not watching anything", subtitle: 'Mark something as "Watching" to track your progress here.' },
  watched: { icon: 'checkmark-circle-outline' as const, title: 'No titles watched yet', subtitle: 'After you watch something, mark it as Watched to see it here.' },
};

export default function MyListsScreen() {
  const { items } = useWatchlist();
  const [activeTab, setActiveTab] = useState<WatchStatus>('watchlist');

  const filtered = items.filter((i) => i.status === activeTab);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>watcho</Text>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const count = items.filter((i) => i.status === tab).length;
          const active = tab === activeTab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, active && { borderBottomColor: StatusColors[tab] }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabLabel, active && { color: Colors.text }]}>
                {StatusLabels[tab]}
              </Text>
              {count > 0 && (
                <View style={[styles.count, { backgroundColor: active ? StatusColors[tab] : Colors.surfaceHighlight }]}>
                  <Text style={styles.countText}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <FlatList<MediaItem>
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => `${item.mediaType}-${item.id}`}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <MediaCard item={item} statusBadge={undefined} style={styles.gridItem} />
        )}
        ListEmptyComponent={
          <EmptyState {...EMPTY_CONFIG[activeTab]} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    color: Colors.accent,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
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
  tabLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  count: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  gridItem: {
    flex: 1,
    maxWidth: '50%',
  },
});
