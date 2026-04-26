import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RatingStars } from '@/components/RatingStars';
import { Colors, StatusColors } from '@/constants/Colors';
import { useWatchlist } from '@/context/WatchlistContext';

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { stats, items } = useWatchlist();

  const movieCount = items.filter((i) => i.mediaType === 'movie' && i.status === 'watched').length;
  const tvCount = items.filter((i) => i.mediaType === 'tv' && i.status === 'watched').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Your Stats</Text>

        <View style={styles.statsRow}>
          <StatCard label="Watched" value={stats.totalWatched} color={Colors.success} icon="checkmark-circle" />
          <StatCard label="Watching" value={stats.totalWatching} color={StatusColors.watching} icon="play-circle" />
          <StatCard label="Watchlist" value={stats.totalWatchlist} color={StatusColors.watchlist} icon="bookmark" />
        </View>

        {stats.totalWatched > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breakdown</Text>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownItem}>
                <Ionicons name="film" size={20} color={Colors.textDim} />
                <Text style={styles.breakdownValue}>{movieCount}</Text>
                <Text style={styles.breakdownLabel}>Movies</Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownItem}>
                <Ionicons name="tv" size={20} color={Colors.textDim} />
                <Text style={styles.breakdownValue}>{tvCount}</Text>
                <Text style={styles.breakdownLabel}>TV Shows</Text>
              </View>
              {stats.averageRating > 0 && (
                <>
                  <View style={styles.breakdownDivider} />
                  <View style={styles.breakdownItem}>
                    <Ionicons name="star" size={20} color={Colors.gold} />
                    <Text style={styles.breakdownValue}>{stats.averageRating}</Text>
                    <Text style={styles.breakdownLabel}>Avg Rating</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {stats.topGenres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Genres</Text>
            {stats.topGenres.map((g, i) => (
              <View key={g.name} style={styles.genreRow}>
                <Text style={styles.genreRank}>#{i + 1}</Text>
                <Text style={styles.genreName}>{g.name}</Text>
                <View style={styles.genreBarBg}>
                  <View
                    style={[
                      styles.genreBarFill,
                      { width: `${(g.count / stats.topGenres[0].count) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.genreCount}>{g.count}</Text>
              </View>
            ))}
          </View>
        )}

        {items.length === 0 && (
          <View style={styles.emptyHint}>
            <Text style={styles.emptyText}>Start adding movies and TV shows to see your stats here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  heading: { color: Colors.text, fontSize: 24, fontWeight: '800', marginVertical: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 3,
  },
  statValue: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  statLabel: { color: Colors.textDim, fontSize: 11, fontWeight: '500' },
  section: { marginBottom: 24 },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', marginBottom: 14 },
  breakdownRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  breakdownItem: { flex: 1, alignItems: 'center', gap: 6 },
  breakdownValue: { color: Colors.text, fontSize: 20, fontWeight: '700' },
  breakdownLabel: { color: Colors.textDim, fontSize: 12 },
  breakdownDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  genreRank: { color: Colors.textMuted, fontSize: 12, width: 20 },
  genreName: { color: Colors.text, fontSize: 14, width: 90 },
  genreBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  genreBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  genreCount: { color: Colors.textDim, fontSize: 12, width: 20, textAlign: 'right' },
  emptyHint: { alignItems: 'center', paddingTop: 40 },
  emptyText: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
