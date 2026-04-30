import { ScrollView, StyleSheet } from 'react-native';
import { MediaCard } from '@/components/MediaCard';
import type { MediaType, TMDBSearchResult } from '@/types';

interface Props {
  items: TMDBSearchResult[];
  mediaType: MediaType;
}

export function RecommendationsRow({ items, mediaType }: Props) {
  if (items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          mediaType={mediaType}
          style={styles.card}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingRight: 8 },
  card: { flex: 0, width: 110, maxWidth: 110 },
});
