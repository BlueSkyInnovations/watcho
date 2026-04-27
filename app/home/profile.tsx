import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusColors } from '@/constants/Colors';
import { useWatchlist } from '@/context/WatchlistContext';
import { useColors } from '@/hooks/useColors';

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderTopColor: color }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textDim }]}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { stats, items } = useWatchlist();
  const colors = useColors();
  const router = useRouter();

  const movieCount = items.filter((i) => i.mediaType === 'movie' && i.status === 'watched').length;
  const tvCount = items.filter((i) => i.mediaType === 'tv' && i.status === 'watched').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')} hitSlop={10} style={styles.gearButton}>
              <Ionicons name="settings-outline" size={22} color={colors.textDim} />
            </Pressable>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={[styles.heading, { color: colors.text }]}>Your Stats</Text>

        <View style={styles.statsRow}>
          <StatCard label="Watched" value={stats.totalWatched} color={colors.success} icon="checkmark-circle" />
          <StatCard label="Watching" value={stats.totalWatching} color={StatusColors.watching} icon="play-circle" />
          <StatCard label="Watchlist" value={stats.totalWatchlist} color={StatusColors.watchlist} icon="bookmark" />
        </View>

        {stats.totalWatched > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Breakdown</Text>
            <View style={[styles.breakdownRow, { backgroundColor: colors.surface }]}>
              <View style={styles.breakdownItem}>
                <Ionicons name="film" size={20} color={colors.textDim} />
                <Text style={[styles.breakdownValue, { color: colors.text }]}>{movieCount}</Text>
                <Text style={[styles.breakdownLabel, { color: colors.textDim }]}>Movies</Text>
              </View>
              <View style={[styles.breakdownDivider, { backgroundColor: colors.border }]} />
              <View style={styles.breakdownItem}>
                <Ionicons name="tv" size={20} color={colors.textDim} />
                <Text style={[styles.breakdownValue, { color: colors.text }]}>{tvCount}</Text>
                <Text style={[styles.breakdownLabel, { color: colors.textDim }]}>TV Shows</Text>
              </View>
              {stats.averageRating > 0 && (
                <>
                  <View style={[styles.breakdownDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.breakdownItem}>
                    <Ionicons name="star" size={20} color={colors.gold} />
                    <Text style={[styles.breakdownValue, { color: colors.text }]}>{stats.averageRating}</Text>
                    <Text style={[styles.breakdownLabel, { color: colors.textDim }]}>Avg Rating</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {stats.topGenres.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Genres</Text>
            {stats.topGenres.map((g, i) => (
              <View key={g.name} style={styles.genreRow}>
                <Text style={[styles.genreRank, { color: colors.textMuted }]}>#{i + 1}</Text>
                <Text style={[styles.genreName, { color: colors.text }]}>{g.name}</Text>
                <View style={[styles.genreBarBg, { backgroundColor: colors.surfaceHighlight }]}>
                  <View style={[styles.genreBarFill, { width: `${(g.count / stats.topGenres[0].count) * 100}%`, backgroundColor: colors.accent }]} />
                </View>
                <Text style={[styles.genreCount, { color: colors.textDim }]}>{g.count}</Text>
              </View>
            ))}
          </View>
        )}

        {items.length === 0 && (
          <View style={styles.emptyHint}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Start adding movies and TV shows to see your stats here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  gearButton: { marginRight: 4 },
  heading: { fontSize: 24, fontWeight: '800', marginVertical: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 6, borderTopWidth: 3 },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
  breakdownRow: { flexDirection: 'row', borderRadius: 12, padding: 16, alignItems: 'center' },
  breakdownItem: { flex: 1, alignItems: 'center', gap: 6 },
  breakdownValue: { fontSize: 20, fontWeight: '700' },
  breakdownLabel: { fontSize: 12 },
  breakdownDivider: { width: 1, height: 40 },
  genreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  genreRank: { fontSize: 12, width: 20 },
  genreName: { fontSize: 14, width: 90 },
  genreBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  genreBarFill: { height: '100%', borderRadius: 3 },
  genreCount: { fontSize: 12, width: 20, textAlign: 'right' },
  emptyHint: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
