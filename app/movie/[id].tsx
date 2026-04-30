import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RatingStars } from '@/components/RatingStars';
import { RecommendationsRow } from '@/components/RecommendationsRow';
import { ReviewInput } from '@/components/ReviewInput';
import { StatusSelector } from '@/components/StatusSelector';
import { StreamingProviders } from '@/components/StreamingProviders';
import { TrailerModal } from '@/components/TrailerModal';
import { useSettings } from '@/context/SettingsContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { useColors } from '@/hooks/useColors';
import { useMovieDetail, useRecommendations, useVideos, useWatchProviders } from '@/hooks/useTMDB';
import { BACKDROP_URL, POSTER_URL } from '@/lib/tmdb';
import { WatchStatus } from '@/types';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { movie, loading, error } = useMovieDetail(movieId);
  const { videos } = useVideos('movie', movieId);
  const { providers, region } = useWatchProviders('movie', movieId);
  const { results: recommendations } = useRecommendations('movie', movieId);
  const { showWhereToWatch, showMoreLikeThis, showReview } = useSettings();
  const [trailerVisible, setTrailerVisible] = useState(false);
  const { getItem, addItem, removeItem, updateStatus, updateRating, updateReview } = useWatchlist();

  const tracked = getItem(movieId, 'movie');

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.accent }]}>{error ?? t('detail.failedToLoad')}</Text>
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

  return (
    <>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.backdrop}>
        {backdropUri ? (
          <Image source={{ uri: backdropUri }} style={styles.backdropImage} resizeMode="cover" />
        ) : (
          <View style={[styles.backdropImage, { backgroundColor: colors.surface }]} />
        )}
        <LinearGradient colors={['transparent', colors.background]} style={styles.gradient} />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          {posterUri && <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />}
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text }]}>{movie.title}</Text>
            <View style={styles.metaRow}>
              {year && <Text style={[styles.meta, { color: colors.textDim }]}>{year}</Text>}
              {runtime && <Text style={[styles.meta, { color: colors.textDim }]}>{runtime}</Text>}
            </View>
            {movie.vote_average > 0 && (
              <View style={styles.tmdbRating}>
                <Ionicons name="star" size={13} color={colors.gold} />
                <Text style={[styles.tmdbRatingText, { color: colors.gold }]}>{movie.vote_average.toFixed(1)} TMDB</Text>
              </View>
            )}
          </View>
        </View>

        {(movie.genres?.length ?? 0) > 0 && (
          <View style={styles.genres}>
            {movie.genres!.map((g) => (
              <View key={g.id} style={[styles.genre, { backgroundColor: colors.surfaceHighlight, borderColor: colors.border }]}>
                <Text style={[styles.genreText, { color: colors.textDim }]}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {movie.overview ? <Text style={[styles.overview, { color: colors.textDim }]}>{movie.overview}</Text> : null}

        {videos.length > 0 && (
          <Pressable
            style={[styles.trailerButton, { backgroundColor: colors.accent }]}
            onPress={() => setTrailerVisible(true)}
          >
            <Ionicons name="play-circle-outline" size={20} color="#fff" />
            <Text style={styles.trailerText}>
              {videos.length === 1 ? t('detail.watchTrailer') : t('detail.watchTrailers', { count: videos.length })}
            </Text>
          </Pressable>
        )}

        {showWhereToWatch && providers && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.whereToWatch')}</Text>
            <StreamingProviders providers={providers} region={region} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.addToList')}</Text>
          <StatusSelector value={tracked?.status} onChange={handleStatusChange} />
        </View>

        {tracked && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.yourRating')}</Text>
            <RatingStars value={tracked.userRating ?? 0} onChange={(r) => updateRating(movieId, 'movie', r)} />
          </View>
        )}

        {tracked && showReview && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.yourReview')}</Text>
            <ReviewInput
              value={tracked.review ?? ''}
              onSave={(text) => updateReview(movieId, 'movie', text)}
            />
          </View>
        )}

        {tracked && (
          <Pressable style={[styles.removeButton, { borderColor: colors.accentDim }]} onPress={() => removeItem(movieId, 'movie')}>
            <Ionicons name="trash-outline" size={16} color={colors.accent} />
            <Text style={[styles.removeText, { color: colors.accent }]}>{t('detail.removeFromLists')}</Text>
          </Pressable>
        )}

        {showMoreLikeThis && recommendations.length > 0 && (
          <View style={[styles.section, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.moreLikeThis')}</Text>
            <RecommendationsRow items={recommendations} mediaType="movie" />
          </View>
        )}
      </View>
    </ScrollView>

    <TrailerModal
      visible={trailerVisible}
      onClose={() => setTrailerVisible(false)}
      title={movie.title}
      mediaType="movie"
      mediaId={movieId}
      initialVideos={videos}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16 },
  backdrop: { height: 260, position: 'relative' },
  backdropImage: { width: '100%', height: '100%' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  backButton: {
    position: 'absolute', top: 50, left: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  titleRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  poster: { width: 80, height: 120, borderRadius: 8 },
  titleBlock: { flex: 1, justifyContent: 'flex-end', paddingBottom: 4 },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  meta: { fontSize: 13 },
  tmdbRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  tmdbRatingText: { fontSize: 13, fontWeight: '600' },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  genre: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  genreText: { fontSize: 12 },
  overview: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  trailerButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: 12, marginBottom: 24,
  },
  trailerText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  removeButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderRadius: 10, borderWidth: 1, justifyContent: 'center',
  },
  removeText: { fontSize: 14, fontWeight: '600' },
});
