import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RatingStars } from '@/components/RatingStars';
import { StatusSelector } from '@/components/StatusSelector';
import { Colors } from '@/constants/Colors';
import { useWatchlist } from '@/context/WatchlistContext';
import { useTVDetail } from '@/hooks/useTMDB';
import { BACKDROP_URL, POSTER_URL } from '@/lib/tmdb';
import { WatchStatus } from '@/types';

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const showId = Number(id);
  const router = useRouter();
  const { show, loading, error } = useTVDetail(showId);
  const { getItem, addItem, removeItem, updateStatus, updateRating, updateProgress } = useWatchlist();

  const tracked = getItem(showId, 'tv');

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (error || !show) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'Failed to load'}</Text>
      </View>
    );
  }

  const backdropUri = BACKDROP_URL(show.backdrop_path);
  const posterUri = POSTER_URL(show.poster_path);
  const year = show.first_air_date?.slice(0, 4);
  const seasons = show.number_of_seasons;

  function handleStatusChange(status: WatchStatus) {
    if (!tracked) {
      addItem({
        id: showId,
        mediaType: 'tv',
        title: show!.name,
        posterPath: show!.poster_path,
        backdropPath: show!.backdrop_path,
        overview: show!.overview,
        releaseDate: show!.first_air_date,
        voteAverage: show!.vote_average,
        genres: show!.genres ?? [],
        status,
        numberOfSeasons: show!.number_of_seasons,
      });
    } else {
      updateStatus(showId, 'tv', status);
    }
  }

  function handleRemove() {
    removeItem(showId, 'tv');
  }

  const currentSeason = tracked?.currentSeason ?? 1;
  const currentEpisode = tracked?.currentEpisode ?? 1;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.backdrop}>
        {backdropUri ? (
          <Image source={{ uri: backdropUri }} style={styles.backdropImage} resizeMode="cover" />
        ) : (
          <View style={[styles.backdropImage, { backgroundColor: Colors.surface }]} />
        )}
        <LinearGradient
          colors={['transparent', Colors.background]}
          style={styles.gradient}
        />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          {posterUri && (
            <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
          )}
          <View style={styles.titleBlock}>
            <View style={styles.tvBadge}>
              <Text style={styles.tvBadgeText}>TV SHOW</Text>
            </View>
            <Text style={styles.title}>{show.name}</Text>
            <View style={styles.metaRow}>
              {year && <Text style={styles.meta}>{year}</Text>}
              {seasons && <Text style={styles.meta}>{seasons} season{seasons !== 1 ? 's' : ''}</Text>}
            </View>
            {show.vote_average > 0 && (
              <View style={styles.tmdbRating}>
                <Ionicons name="star" size={13} color={Colors.gold} />
                <Text style={styles.tmdbRatingText}>
                  {show.vote_average.toFixed(1)} TMDB
                </Text>
              </View>
            )}
          </View>
        </View>

        {(show.genres?.length ?? 0) > 0 && (
          <View style={styles.genres}>
            {show.genres!.map((g) => (
              <View key={g.id} style={styles.genre}>
                <Text style={styles.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {show.overview ? (
          <Text style={styles.overview}>{show.overview}</Text>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add to list</Text>
          <StatusSelector value={tracked?.status} onChange={handleStatusChange} />
        </View>

        {tracked?.status === 'watching' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressControl}>
                <Text style={styles.progressLabel}>Season</Text>
                <View style={styles.stepper}>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => updateProgress(showId, Math.max(1, currentSeason - 1), currentEpisode)}
                  >
                    <Ionicons name="remove" size={18} color={Colors.text} />
                  </Pressable>
                  <Text style={styles.stepValue}>{currentSeason}</Text>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => updateProgress(showId, Math.min(seasons ?? 99, currentSeason + 1), currentEpisode)}
                  >
                    <Ionicons name="add" size={18} color={Colors.text} />
                  </Pressable>
                </View>
              </View>
              <View style={styles.progressControl}>
                <Text style={styles.progressLabel}>Episode</Text>
                <View style={styles.stepper}>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => updateProgress(showId, currentSeason, Math.max(1, currentEpisode - 1))}
                  >
                    <Ionicons name="remove" size={18} color={Colors.text} />
                  </Pressable>
                  <Text style={styles.stepValue}>{currentEpisode}</Text>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => updateProgress(showId, currentSeason, currentEpisode + 1)}
                  >
                    <Ionicons name="add" size={18} color={Colors.text} />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}

        {tracked && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your rating</Text>
            <RatingStars
              value={tracked.userRating ?? 0}
              onChange={(r) => updateRating(showId, 'tv', r)}
            />
          </View>
        )}

        {tracked && (
          <Pressable style={styles.removeButton} onPress={handleRemove}>
            <Ionicons name="trash-outline" size={16} color={Colors.accent} />
            <Text style={styles.removeText}>Remove from lists</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.accent, fontSize: 16 },
  backdrop: { height: 260, position: 'relative' },
  backdropImage: { width: '100%', height: '100%' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  titleRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  poster: { width: 80, height: 120, borderRadius: 8 },
  titleBlock: { flex: 1, justifyContent: 'flex-end', paddingBottom: 4 },
  tvBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentDim,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  tvBadgeText: { color: Colors.accent, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  title: { color: Colors.text, fontSize: 20, fontWeight: '700', lineHeight: 26 },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  meta: { color: Colors.textDim, fontSize: 13 },
  tmdbRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  tmdbRatingText: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  genre: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genreText: { color: Colors.textDim, fontSize: 12 },
  overview: { color: Colors.textDim, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { color: Colors.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  progressRow: { flexDirection: 'row', gap: 16 },
  progressControl: { flex: 1, alignItems: 'center', gap: 8 },
  progressLabel: { color: Colors.textDim, fontSize: 13 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  stepBtn: { paddingHorizontal: 14, paddingVertical: 10 },
  stepValue: { color: Colors.text, fontSize: 16, fontWeight: '700', minWidth: 36, textAlign: 'center' },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accentDim,
    justifyContent: 'center',
  },
  removeText: { color: Colors.accent, fontSize: 14, fontWeight: '600' },
});
