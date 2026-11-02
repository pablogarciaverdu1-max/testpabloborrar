import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { categories, colors, radius, type CategoryId } from '@/theme';

import { Txt } from './Txt';

type Props = {
  category: CategoryId;
  label?: string;
  uri?: string;
  aspect?: number;
  style?: StyleProp<ViewStyle>;
  rounded?: number;
  compact?: boolean;
};

/** Foto: real si viene del carrete, o bloque de color de categoría con etiqueta discreta. */
export function PhotoBlock({ category, label, uri, aspect = 4 / 3, style, rounded = radius.tile, compact }: Props) {
  const cat = categories[category];
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ aspectRatio: aspect, borderRadius: rounded, backgroundColor: colors.surface }, style as object]}
        contentFit="cover"
        transition={200}
        accessibilityLabel="Foto"
      />
    );
  }
  return (
    <View
      accessible
      accessibilityLabel={label ? label.replace('Foto · ', 'Foto de ') : 'Foto'}
      style={[styles.block, { aspectRatio: aspect, borderRadius: rounded, backgroundColor: cat.solid }, style]}
    >
      <View style={[styles.circle, { backgroundColor: cat.soft }]} />
      <View style={[styles.pill, { backgroundColor: cat.ink }]} />
      {label ? (
        <View style={[styles.label, compact && styles.labelCompact]}>
          <Txt variant="caption" color={colors.ink} numberOfLines={compact ? 2 : 1}>
            [{label}]
          </Txt>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { overflow: 'hidden', justifyContent: 'flex-end' },
  circle: { position: 'absolute', width: '70%', aspectRatio: 1, borderRadius: 999, right: '-18%', top: '-30%', opacity: 0.55 },
  pill: { position: 'absolute', width: '55%', height: 34, borderRadius: 999, left: '-10%', bottom: '28%', opacity: 0.18, transform: [{ rotate: '-18deg' }] },
  label: { margin: 10, alignSelf: 'flex-start', backgroundColor: colors.glass, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  labelCompact: { margin: 6, paddingHorizontal: 6 },
});
