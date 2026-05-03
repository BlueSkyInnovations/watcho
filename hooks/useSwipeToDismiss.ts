import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, PanResponder, useWindowDimensions } from 'react-native';

export function useSwipeToDismiss(visible: boolean, onClose: () => void) {
  const { height } = useWindowDimensions();
  const dragY = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Stable ref so the PanResponder closure (created once) always calls current dismiss
  const dismissRef = useRef<() => void>(() => {});

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(dragY, {
        toValue: height,
        duration: 260,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      // Call onClose only — do NOT reset values here.
      // Resetting here causes a one-frame flash (sheet jumps back to y=0 before
      // the modal hides). We reset at the top of the next open instead.
      if (finished) onClose();
    });
  }, [dragY, backdropOpacity, height, onClose]);

  dismissRef.current = dismiss;

  const panResponder = useRef(
    PanResponder.create({
      // Claim the touch immediately on the handle zone so Pressable ancestors
      // cannot grab it first (which would prevent onMove* from ever firing).
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) dragY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 100 || vy > 0.8) {
          dismissRef.current();
        } else {
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 14,
            tension: 100,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 14,
          tension: 100,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    if (!visible) return;
    // Reset position (may already be at height from previous dismiss, or 0 on first open)
    dragY.setValue(height);
    backdropOpacity.setValue(0);
    // Entry: smooth ease-out timing avoids the overshoot/bounce of an underdamped spring
    Animated.parallel([
      Animated.timing(dragY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return { dragY, backdropOpacity, panHandlers: panResponder.panHandlers, dismiss };
}
