import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, gutter, motion, space } from '@/theme';

import { IconButton } from './IconButton';
import { Txt } from './Txt';

/** Barra de progreso de 3 pasos con botón atrás. */
export function OnboardingHeader({ step }: { step: 1 | 2 | 3 }) {
  const progress = useSharedValue((step - 1) / 3);
  useEffect(() => {
    progress.set(withTiming(step / 3, { duration: motion.slow }));
  }, [step, progress]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View style={styles.wrap}>
      <IconButton
        icon={ChevronLeft}
        label="Atrás"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
      />
      <View
        style={styles.track}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Paso ${step} de 3`}
        accessibilityValue={{ min: 0, max: 3, now: step }}
      >
        <Animated.View style={[styles.fill, fill]} />
      </View>
      <Txt variant="footnoteStrong" color={colors.text2} style={styles.count}>
        {step}/3
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: gutter, paddingVertical: space.sm },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.surface, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  count: { minWidth: 28, textAlign: 'right' },
});
