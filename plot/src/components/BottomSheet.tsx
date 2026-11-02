import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { GestureDetector, GestureHandlerRootView, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { colors, gutter, motion, radius, space } from '@/theme';

import { Txt } from './Txt';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  /** Altura máxima relativa a la pantalla. */
  maxHeight?: number;
};

/** Hoja inferior con grabber, fondo oscurecido y cierre arrastrando hacia abajo. */
export function BottomSheet({ visible, onClose, title, subtitle, children, maxHeight = 0.88 }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(visible);
  const y = useSharedValue(height);
  const backdrop = useSharedValue(0);

  // Montar en cuanto se pide abrir (estado derivado durante el render).
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      y.set(height);
      y.set(reduced ? withTiming(0, { duration: motion.fast }) : withSpring(0, motion.spring));
      backdrop.set(withTiming(1, { duration: motion.base }));
    } else {
      backdrop.set(withTiming(0, { duration: motion.fast }));
      y.set(withTiming(height, { duration: motion.base, easing: Easing.in(Easing.quad) }, (done) => {
        if (done) scheduleOnRN(setMounted, false);
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const pan = usePanGesture({
    activeOffsetY: 8,
    onUpdate: (e) => {
      'worklet';
      y.set(Math.max(0, e.translationY));
    },
    onDeactivate: (e) => {
      'worklet';
      if (e.translationY > 110 || e.velocityY > 900) {
        scheduleOnRN(onClose);
      } else {
        y.set(withSpring(0, motion.spring));
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  if (!mounted) return null;

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cerrar hoja"
          />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          style={[styles.sheet, { maxHeight: height * maxHeight, paddingBottom: Math.max(insets.bottom, space.lg) }, sheetStyle]}
        >
          <GestureDetector gesture={pan}>
            <View style={styles.handleArea}>
              <View style={styles.grabber} />
              {title ? (
                <View style={styles.header}>
                  <Txt variant="title2">{title}</Txt>
                  {subtitle ? (
                    <Txt variant="subhead" color={colors.text2}>
                      {subtitle}
                    </Txt>
                  ) : null}
                </View>
              ) : null}
            </View>
          </GestureDetector>
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: colors.scrim },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    overflow: 'hidden',
  },
  handleArea: { paddingTop: space.sm, paddingHorizontal: gutter, paddingBottom: space.sm },
  grabber: { alignSelf: 'center', width: 38, height: 5, borderRadius: 3, backgroundColor: colors.line, marginBottom: space.md },
  header: { gap: 4, paddingBottom: space.sm },
  body: { paddingHorizontal: gutter, flexShrink: 1 },
});
