import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RatingStars } from '@/components/RatingStars';
import { StatusSelector } from '@/components/StatusSelector';
import { Colors } from '@/constants/Colors';
import { useWatchlist } from '@/context/WatchlistContext';
import { useMovieDetail } from '@/hooks/useTMDB';
import { BACKDROP_URL, POSTER_URL } from '@/lib/tmdb';
import { WatchStatus } from '@/types';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const router = useRouter();
  const { movie, loading, error } = useMovieDetail(movieId);
  const { getItem, addItem, removeItem, updateStatus, updateRating } = useWatchlist();

  const tracked = getItem(movieId, 'movie');

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'Failed to load'}</Text>
      </View>
    );
  }

  const backdropUri = BACKDROP_URL(movie.backdrop_path);
  const posterUri = POSTER_URL(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  function handleStatusChange(status: WatchStatus) {
    if (!tracked) {
      addItem({
        id: movieId,
        mediaType: 'movie',
        title: movie!.title,
        posterPath: movie!.poster_path,
        backdropPath: movie!.backdrop_path,
        overview: movie!.overview,
        releaseDate: movie!.release_date,
        voteAverage: movie!.vote_average,
        genres: movie!.genres ?? [],
        status,
      });
    } else {
      updateStatus(movieId, 'movie', status);
    }
  }

  function handleRemove() {
    removeItem(movieId, 'movie');
  }

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
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.metaRow}>
              {year && <Text style={styles.meta}>{year}</Text>}
              {runtime && <Text style={styles.meta}>{runtime}</Text>}
            </View>
            {movie.vote_average > 0 && (
              <View style={styles.tmdbRating}>
                <Ionicons name="star" size={13} color={Colors.gold} />
                <Text style={styles.tmdbRatingText}>
                  {movie.vote_average.toFixed(1)} TMDB
                </Text>
              </View>
            )}
          </View>
        </View>

        {(movie.genres?.length ?? 0) > 0 && (
          <View style={styles.genres}>
            {movie.genres!.map((g) => (
              <View key={g.id} style={styles.genre}>
                <Text style={styles.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {movie.overview ? (
          <Text style={styles.overview}>{movie.overview}</Text>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add to list</Text>
          <StatusSelector value={tracked?.status} onChange={handleStatusChange} />
        </View>

        {tracked && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your rating</Text>
            <RatingStars
              value={tracked.userRating ?? 0}
              onChange={(r) => updateRating(movieId, 'movie', r)}
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
