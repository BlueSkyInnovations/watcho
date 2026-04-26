import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, StatusColors, StatusLabels } from '@/constants/Colors';
import { POSTER_URL } from '@/lib/tmdb';
import { MediaItem, MediaType, TMDBSearchResult } from '@/types';

interface MediaCardProps {
  item: TMDBSearchResult | MediaItem;
  mediaType?: MediaType;
  statusBadge?: string;
  onPress?: () => void;
  style?: object;
}

function getFields(item: TMDBSearchResult | MediaItem, mediaType?: MediaType) {
  if ('mediaType' in item) {
    return {
      id: item.id,
      type: item.mediaType,
      title: item.title,
      poster: item.posterPath,
      year: item.releaseDate?.slice(0, 4) ?? '',
      rating: item.voteAverage,
    };
  }
  const type = (item.media_type === 'movie' || item.media_type === 'tv')
    ? item.media_type
    : (mediaType ?? 'movie');
  return {
    id: item.id,
    type,
    title: item.title ?? item.name ?? 'Unknown',
    poster: item.poster_path,
    year: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
    rating: item.vote_average,
  };
}

export function MediaCard({ item, mediaType, statusBadge, onPress, style }: MediaCardProps) {
  const router = useRouter();
  const { id, type, title, poster, year, rating } = getFields(item, mediaType);

  const handlePress = () => {
    if (onPress) { onPress(); return; }
    if (type === 'movie') router.push(`/movie/${id}`);
    else router.push(`/tv/${id}`);
  };

  const posterUri = POSTER_URL(poster);

  return (
    <Pressable style={[styles.card, style]} onPress={handlePress}>
      <View style={styles.posterContainer}>
        {posterUri ? (
          <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={styles.posterFallback}>
            <Ionicons name="film-outline" size={32} color={Colors.textMuted} />
          </View>
        )}
        {statusBadge && (
          <View style={[styles.badge, { backgroundColor: StatusColors[statusBadge] }]}>
            <Text style={styles.badgeText}>{StatusLabels[statusBadge]}</Text>
          </View>
        )}
        <View style={styles.typePill}>
          <Text style={styles.typeText}>{type === 'tv' ? 'TV' : 'Film'}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.meta}>
          {year ? <Text style={styles.year}>{year}</Text> : null}
          {rating > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={10} color={Colors.gold} />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%',
    padding: 6,
  },
  posterContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    aspectRatio: 2 / 3,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceHighlight,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  typePill: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  typeText: {
    color: Colors.textDim,
    fontSize: 9,
    fontWeight: '600',
  },
  info: {
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  title: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  year: {
    color: Colors.textDim,
    fontSize: 11,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: Colors.textDim,
    fontSize: 11,
  },
});
