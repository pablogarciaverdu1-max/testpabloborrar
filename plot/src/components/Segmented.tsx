import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { colors, motion, radius } from '@/theme';
import { tapLight } from '@/utils/haptics';

import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Option<T extends string> = { value: T; label: string; badge?: number };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  accessibilityLabel?: string;
};

/** Control segmentado estilo iOS con indicador animado. */
export function Segmented<T extends string>({ options, value, onChange, accessibilityLabel }: Props<T>) {
  const [width, setWidth] = useState(0);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const segW = width > 0 ? (width - 4) / options.length : 0;
  const indicator = useAnimatedStyle(() => ({
    width: segW,
    transform: [{ translateX: withSpring(index * segW, motion.spring) }],
  }));
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={styles.track}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
    >
      {segW > 0 ? <Animated.View style={[styles.indicator, indicator]} /> : null}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <PressableScale
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={o.badge ? `${o.label}, ${o.badge}` : o.label}
            scaleTo={0.98}
            onPress={() => {
              if (!active) {
                tapLight();
                onChange(o.value);
              }
            }}
            style={styles.seg}
          >
            <Txt variant="subheadStrong" color={active ? colors.ink : colors.text2} numberOfLines={1} align="center">
              {o.label}
            </Txt>
            {o.badge ? (
              <View style={[styles.badge, { backgroundColor: active ? colors.primary : colors.text3 }]}>
                <Txt variant="caption" color={colors.white} maxFontSizeMultiplier={1.2}>
                  {o.badge}
                </Txt>
              </View>
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.button - 3, padding: 2, minHeight: 44 },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    backgroundColor: colors.bg,
    borderRadius: radius.button - 5,
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  seg: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 6, paddingVertical: 8 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
});
