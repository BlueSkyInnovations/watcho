import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { POSTER_URL } from '@/lib/tmdb';
import { MediaItem } from '@/types';

interface Props {
  item: MediaItem;
}

export function MediaListItem({ item }: Props) {
  const router = useRouter();
  const colors = useColors();
  const posterUri = POSTER_URL(item.posterPath, 'w185');
  const year = item.releaseDate?.slice(0, 4) ?? '';
  const showProgress =
    item.mediaType === 'tv' && item.status === 'watching' && item.currentSeason != null;

  function handlePress() {
    router.push(item.mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`);
  }

  return (
    <Pressable
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={handlePress}
    >
      <View style={[styles.poster, { backgroundColor: colors.surface }]}>
        {posterUri ? (
          <Image source={{ uri: posterUri }} style={styles.posterImg} resizeMode="cover" />
        ) : (
          <View style={[styles.posterFallback, { backgroundColor: colors.surfaceHighlight }]}>
            <Ionicons name="film-outline" size={22} color={colors.textMuted} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          {year ? <Text style={[styles.meta, { color: colors.textMuted }]}>{year}</Text> : null}
          <Text style={[styles.metaDot, { color: colors.textMuted }]}>·</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {item.mediaType === 'tv' ? 'TV' : 'Film'}
          </Text>
          {item.voteAverage > 0 && (
            <>
              <Text style={[styles.metaDot, { color: colors.textMuted }]}>·</Text>
              <Ionicons name="star" size={10} color={colors.gold} />
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {item.voteAverage.toFixed(1)}
              </Text>
            </>
          )}
          {item.userRating != null && (
            <>
              <Text style={[styles.metaDot, { color: colors.textMuted }]}>·</Text>
              <Ionicons name="star" size={10} color={colors.accent} />
              <Text style={[styles.meta, { color: colors.accent }]}>{item.userRating}</Text>
            </>
          )}
        </View>

        {item.genres.length > 0 && (
          <View style={styles.genreRow}>
            {item.genres.slice(0, 3).map((g) => (
              <View key={g.id} style={[styles.genreTag, { backgroundColor: colors.surfaceHighlight }]}>
                <Text style={[styles.genreText, { color: colors.textDim }]}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {showProgress && (
          <Text style={[styles.progress, { color: colors.textMuted }]}>
            {'Season ' + item.currentSeason + ', Episode ' + (item.currentEpisode ?? 1)}
            {item.numberOfSeasons
              ? ' · ' + item.numberOfSeasons + ' season' + (item.numberOfSeasons > 1 ? 's' : '')
              : ''}
          </Text>
        )}
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.border} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  poster: {
    width: 56,
    height: 84,
    borderRadius: 6,
    overflow: 'hidden',
    flexShrink: 0,
  },
  posterImg: { width: '100%', height: '100%' },
  posterFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontWeight: '600', lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 3 },
  meta: { fontSize: 12 },
  metaDot: { fontSize: 12 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  genreTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genreText: { fontSize: 11, fontWeight: '500' },
  progress: { fontSize: 11, marginTop: 2 },
  chevron: { flexShrink: 0 },
});
