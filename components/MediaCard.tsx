import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusColors, StatusLabels } from '@/constants/Colors';
import { useColors } from '@/hooks/useColors';
import { POSTER_URL } from '@/lib/tmdb';
import { MediaItem, MediaType, TMDBSearchResult, WatchStatus } from '@/types';

interface MediaCardProps {
  item: TMDBSearchResult | MediaItem;
  mediaType?: MediaType;
  statusBadge?: WatchStatus;
  onPress?: () => void;
  style?: object;
}

function getFields(item: TMDBSearchResult | MediaItem, mediaType?: MediaType) {
  if ('mediaType' in item) {
    return { id: item.id, type: item.mediaType, title: item.title, poster: item.posterPath, year: item.releaseDate?.slice(0, 4) ?? '', rating: item.voteAverage };
  }
  const type = (item.media_type === 'movie' || item.media_type === 'tv') ? item.media_type : (mediaType ?? 'movie');
  return { id: item.id, type, title: item.title ?? item.name ?? 'Unknown', poster: item.poster_path, year: (item.release_date ?? item.first_air_date ?? '').slice(0, 4), rating: item.vote_average };
}

export function MediaCard({ item, mediaType, statusBadge, onPress, style }: MediaCardProps) {
  const router = useRouter();
  const colors = useColors();
  const { id, type, title, poster, year, rating } = getFields(item, mediaType);

  const handlePress = () => {
    if (onPress) { onPress(); return; }
    if (type === 'movie') router.push(`/movie/${id}`);
    else router.push(`/tv/${id}`);
  };

  const posterUri = POSTER_URL(poster);

  return (
    <Pressable style={[styles.card, style]} onPress={handlePress}>
      <View style={[styles.posterContainer, { backgroundColor: colors.surface }]}>
        {posterUri ? (
          <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.posterFallback, { backgroundColor: colors.surfaceHighlight }]}>
            <Ionicons name="film-outline" size={32} color={colors.textMuted} />
          </View>
        )}
        {statusBadge && (
          <View style={[styles.badge, { backgroundColor: StatusColors[statusBadge] }]}>
            <Text style={styles.badgeText}>{StatusLabels[statusBadge]}</Text>
          </View>
        )}
        <View style={styles.typePill}>
          <Text style={[styles.typeText, { color: colors.textDim }]}>{type === 'tv' ? 'TV' : 'Film'}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
        <View style={styles.meta}>
          {year ? <Text style={[styles.year, { color: colors.textDim }]}>{year}</Text> : null}
          {rating > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={10} color={colors.gold} />
              <Text style={[styles.rating, { color: colors.textDim }]}>{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, maxWidth: '50%', padding: 6 },
  posterContainer: { borderRadius: 10, overflow: 'hidden', aspectRatio: 2 / 3 },
  poster: { width: '100%', height: '100%' },
  posterFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  typePill: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
  typeText: { fontSize: 9, fontWeight: '600' },
  info: { paddingTop: 6, paddingHorizontal: 2 },
  title: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  year: { fontSize: 11 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { fontSize: 11 },
});
