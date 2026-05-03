import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EpisodeModal } from '@/components/EpisodeModal';
import { RatingStars } from '@/components/RatingStars';
import { RecommendationsRow } from '@/components/RecommendationsRow';
import { ReviewInput } from '@/components/ReviewInput';
import { StatusSelector } from '@/components/StatusSelector';
import { StreamingProviders } from '@/components/StreamingProviders';
import { TrailerModal } from '@/components/TrailerModal';
import { useSettings } from '@/context/SettingsContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { useColors } from '@/hooks/useColors';
import { useTVDetail, useRecommendations, useVideos, useWatchProviders, useTVSeason, useContentRating } from '@/hooks/useTMDB';
import { BACKDROP_URL, POSTER_URL } from '@/lib/tmdb';
import { TMDBEpisode, WatchStatus } from '@/types';

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const showId = Number(id);
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { show, loading, error } = useTVDetail(showId);
  const { videos } = useVideos('tv', showId);
  const { providers, region } = useWatchProviders('tv', showId);
  const { results: recommendations } = useRecommendations('tv', showId);
  const certification = useContentRating('tv', showId);
  const { showWhereToWatch, showMoreLikeThis, showReview, showEpisodeGuide } = useSettings();
  const [trailerVisible, setTrailerVisible] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<TMDBEpisode | null>(null);
  const { getItem, addItem, removeItem, updateStatus, updateRating, updateProgress, updateReview } = useWatchlist();

  const tracked = getItem(showId, 'tv');
  const currentSeason = tracked?.currentSeason ?? 1;
  const currentEpisode = tracked?.currentEpisode ?? 1;

  const [selectedSeason, setSelectedSeason] = useState(1);
  const seasonSyncedRef = useRef(false);

  useEffect(() => {
    if (!seasonSyncedRef.current && tracked?.status === 'watching' && tracked.currentSeason) {
      seasonSyncedRef.current = true;
      setSelectedSeason(tracked.currentSeason);
    }
  }, [tracked]);

  const { data: seasonData, loading: seasonLoading } = useTVSeason(showId, selectedSeason);
  const episodeListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (
      seasonData?.episodes?.length &&
      tracked?.status === 'watching' &&
      selectedSeason === currentSeason &&
      currentEpisode > 1
    ) {
      const idx = currentEpisode - 1;
      if (idx < seasonData.episodes.length) {
        setTimeout(() => {
          episodeListRef.current?.scrollToIndex({ index: idx, animated: false });
        }, 150);
      }
    }
  }, [seasonData?.episodes]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !show) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.accent }]}>{error ?? t('detail.failedToLoad')}</Text>
      </View>
    );
  }

  const backdropUri = BACKDROP_URL(show.backdrop_path);
  const posterUri = POSTER_URL(show.poster_path);
  const year = show.first_air_date?.slice(0, 4);
  const seasons = show.number_of_seasons;
  const episodeMax = selectedSeason === currentSeason
    ? (seasonData?.episodes.length ?? 99)
    : 99;

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
            <View style={[styles.tvBadge, { backgroundColor: colors.accentDim }]}>
              <Text style={[styles.tvBadgeText, { color: colors.accent }]}>{t('detail.tvShow')}</Text>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{show.name}</Text>
            <View style={styles.metaRow}>
              {year && <Text style={[styles.meta, { color: colors.textDim }]}>{year}</Text>}
              {seasons && <Text style={[styles.meta, { color: colors.textDim }]}>{t('detail.seasons', { count: seasons })}</Text>}
              {certification && (
                <View style={[styles.ratingBadge, { borderColor: colors.textDim }]}>
                  <Text style={[styles.ratingText, { color: colors.textDim }]}>{certification}</Text>
                </View>
              )}
            </View>
            {show.vote_average > 0 && (
              <View style={styles.tmdbRating}>
                <Ionicons name="star" size={13} color={colors.gold} />
                <Text style={[styles.tmdbRatingText, { color: colors.gold }]}>{show.vote_average.toFixed(1)} TMDB</Text>
              </View>
            )}
          </View>
        </View>

        {(show.genres?.length ?? 0) > 0 && (
          <View style={styles.genres}>
            {show.genres!.map((g) => (
              <View key={g.id} style={[styles.genre, { backgroundColor: colors.surfaceHighlight, borderColor: colors.border }]}>
                <Text style={[styles.genreText, { color: colors.textDim }]}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {show.overview ? <Text style={[styles.overview, { color: colors.textDim }]}>{show.overview}</Text> : null}

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

        {tracked?.status === 'watching' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.progress')}</Text>
            <View style={styles.progressRow}>
              {(['season', 'episode'] as const).map((key) => {
                const isSeason = key === 'season';
                const val = isSeason ? currentSeason : currentEpisode;
                const dec = isSeason
                  ? () => updateProgress(showId, Math.max(1, currentSeason - 1), currentEpisode)
                  : () => updateProgress(showId, currentSeason, Math.max(1, currentEpisode - 1));
                const inc = isSeason
                  ? () => updateProgress(showId, Math.min(seasons ?? 99, currentSeason + 1), currentEpisode)
                  : () => updateProgress(showId, currentSeason, Math.min(episodeMax, currentEpisode + 1));
                return (
                  <View key={key} style={styles.progressControl}>
                    <Text style={[styles.progressLabel, { color: colors.textDim }]}>{t(`detail.${key}`)}</Text>
                    <View style={[styles.stepper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Pressable style={styles.stepBtn} onPress={dec}>
                        <Ionicons name="remove" size={18} color={colors.text} />
                      </Pressable>
                      <Text style={[styles.stepValue, { color: colors.text }]}>{val}</Text>
                      <Pressable style={styles.stepBtn} onPress={inc}>
                        <Ionicons name="add" size={18} color={colors.text} />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {showEpisodeGuide && (seasons ?? 0) > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.episodes')}</Text>

            {(seasons ?? 0) > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.pillsScroll}
                contentContainerStyle={styles.pillsContent}
              >
                {Array.from({ length: seasons! }, (_, i) => i + 1).map((s) => (
                  <Pressable
                    key={s}
                    style={[
                      styles.pill,
                      selectedSeason === s
                        ? { backgroundColor: colors.accent }
                        : { backgroundColor: colors.surfaceHighlight, borderColor: colors.border, borderWidth: 1 },
                    ]}
                    onPress={() => setSelectedSeason(s)}
                  >
                    <Text style={[styles.pillText, { color: selectedSeason === s ? '#fff' : colors.textDim }]}>
                      S{s}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {seasonLoading ? (
              <ActivityIndicator size="small" color={colors.accent} style={styles.seasonLoader} />
            ) : (
              <FlatList
                ref={episodeListRef}
                horizontal
                data={seasonData?.episodes ?? []}
                keyExtractor={(ep) => String(ep.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.episodeList}
                onScrollToIndexFailed={() => {}}
                renderItem={({ item: ep }) => {
                  const stillUri = ep.still_path
                    ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                    : null;
                  const isCurrent =
                    tracked?.status === 'watching' &&
                    selectedSeason === currentSeason &&
                    ep.episode_number === currentEpisode;
                  return (
                    <Pressable
                      onPress={() => setSelectedEpisode(ep)}
                      style={[
                        styles.episodeCard,
                        { backgroundColor: colors.surface },
                        isCurrent && { borderColor: colors.accent, borderWidth: 2 },
                      ]}
                    >
                      {stillUri ? (
                        <Image source={{ uri: stillUri }} style={styles.episodeStill} resizeMode="cover" />
                      ) : (
                        <View style={[styles.episodeStill, { backgroundColor: colors.surfaceHighlight, alignItems: 'center', justifyContent: 'center' }]}>
                          <Ionicons name="film-outline" size={20} color={colors.textMuted} />
                        </View>
                      )}
                      <View style={styles.episodeInfo}>
                        <Text style={[styles.episodeNum, { color: colors.accent }]}>E{ep.episode_number}</Text>
                        <Text style={[styles.episodeName, { color: colors.text }]} numberOfLines={1}>{ep.name}</Text>
                        {ep.overview ? (
                          <Text style={[styles.episodeOverview, { color: colors.textDim }]} numberOfLines={3}>{ep.overview}</Text>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        )}

        {tracked && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.yourRating')}</Text>
            <RatingStars value={tracked.userRating ?? 0} onChange={(r) => updateRating(showId, 'tv', r)} />
          </View>
        )}

        {tracked && showReview && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.yourReview')}</Text>
            <ReviewInput
              value={tracked.review ?? ''}
              onSave={(text) => updateReview(showId, 'tv', text)}
            />
          </View>
        )}

        {tracked && (
          <Pressable style={[styles.removeButton, { borderColor: colors.accentDim }]} onPress={() => removeItem(showId, 'tv')}>
            <Ionicons name="trash-outline" size={16} color={colors.accent} />
            <Text style={[styles.removeText, { color: colors.accent }]}>{t('detail.removeFromLists')}</Text>
          </Pressable>
        )}

        {showMoreLikeThis && recommendations.length > 0 && (
          <View style={[styles.section, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.moreLikeThis')}</Text>
            <RecommendationsRow items={recommendations} mediaType="tv" />
          </View>
        )}
      </View>
    </ScrollView>

    <TrailerModal
      visible={trailerVisible}
      onClose={() => setTrailerVisible(false)}
      title={show.name}
      mediaType="tv"
      mediaId={showId}
      initialVideos={videos}
      numberOfSeasons={show.number_of_seasons}
    />

    <EpisodeModal
      visible={selectedEpisode !== null}
      onClose={() => setSelectedEpisode(null)}
      episode={selectedEpisode}
      seasonNumber={selectedSeason}
      showTitle={show.name}
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
  tvBadge: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 6 },
  tvBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
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
  progressRow: { flexDirection: 'row', gap: 16 },
  progressControl: { flex: 1, alignItems: 'center', gap: 8 },
  progressLabel: { fontSize: 13 },
  stepper: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  stepBtn: { paddingHorizontal: 14, paddingVertical: 10 },
  stepValue: { fontSize: 16, fontWeight: '700', minWidth: 36, textAlign: 'center' },
  trailerButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: 12, marginBottom: 24,
  },
  trailerText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  removeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, justifyContent: 'center' },
  removeText: { fontSize: 14, fontWeight: '600' },
  // Episode browser
  pillsScroll: { marginBottom: 12 },
  pillsContent: { gap: 8, paddingRight: 4 },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  pillText: { fontSize: 13, fontWeight: '600' },
  seasonLoader: { marginTop: 12 },
  episodeList: { gap: 12, paddingRight: 4 },
  episodeCard: { width: 160, borderRadius: 10, overflow: 'hidden' },
  episodeStill: { width: 160, height: 90 },
  episodeInfo: { padding: 8, gap: 3 },
  episodeNum: { fontSize: 11, fontWeight: '700' },
  episodeName: { fontSize: 13, fontWeight: '600' },
  episodeOverview: { fontSize: 11, lineHeight: 16 },
  ratingBadge: { borderWidth: 1, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 },
  ratingText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
});
