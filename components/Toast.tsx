import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface Props {
  message: string | null;
  onHide: () => void;
}

export function Toast({ message, onHide }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    if (!message) return;

    opacity.setValue(0);
    translateY.setValue(-16);

    const anim = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(2400),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -10, duration: 250, useNativeDriver: true }),
      ]),
    ]);

    anim.start(({ finished }) => { if (finished) onHide(); });
    return () => anim.stop();
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 12,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
      <Text style={[styles.text, { color: colors.text }]} numberOfLines={1}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
