import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { colors, radius, space } from '@/theme';

function Dot({ delay }: { delay: number }) {
  const reduced = useReducedMotion();
  const v = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    v.set(withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 280 }), withTiming(0, { duration: 280 })), -1)));
  }, [delay, reduced, v]);
  const style = useAnimatedStyle(() => ({ opacity: 0.35 + v.value * 0.65, transform: [{ translateY: -v.value * 3 }] }));
  return <Animated.View style={[styles.dot, style]} />;
}

/** Indicador «escribiendo…». */
export function TypingBubble() {
  return (
    <View style={styles.bubble} accessible accessibilityLabel="Escribiendo" accessibilityLiveRegion="polite">
      <Dot delay={0} />
      <Dot delay={140} />
      <Dot delay={280} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { alignSelf: 'flex-start', flexDirection: 'row', gap: 5, paddingHorizontal: space.lg, paddingVertical: 14, borderRadius: radius.card - 4, borderBottomLeftRadius: 6, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.text3 },
});
