import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface RatingStarsProps {
  value?: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function RatingStars({ value = 0, onChange, size = 28, readonly = false }: RatingStarsProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => !readonly && onChange?.(star === value ? 0 : star)}
          disabled={readonly}
          hitSlop={6}
        >
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={size}
            color={star <= value ? Colors.gold : Colors.textMuted}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
});
