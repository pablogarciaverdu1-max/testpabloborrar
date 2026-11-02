import { Check } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { categoryOf } from '@/data/catalog';
import { categories, colors, radius, space, type CategoryId } from '@/theme';
import { tapLight } from '@/utils/haptics';

import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Props = {
  label: string;
  /** Sólido = seleccionado o en común. Suave = no seleccionado. */
  solid?: boolean;
  category?: CategoryId;
  onPress?: () => void;
  size?: 'sm' | 'md';
  showCheck?: boolean;
};

/** Chip de interés con el color de su categoría. Texto en ink sobre sólido (regla de contraste). */
export function Chip({ label, solid, category, onPress, size = 'md', showCheck }: Props) {
  const cat = categories[category ?? categoryOf(label)];
  const content = (
    <>
      {showCheck && solid ? <Check size={14} color={colors.ink} strokeWidth={2.4} /> : null}
      <Txt variant={size === 'sm' ? 'footnoteStrong' : 'subheadStrong'} color={solid ? colors.ink : cat.ink}>
        {label}
      </Txt>
    </>
  );
  const style = [
    styles.base,
    size === 'sm' ? styles.sm : styles.md,
    { backgroundColor: solid ? cat.solid : cat.soft },
  ];
  if (!onPress) {
    return <View style={style}>{content}</View>;
  }
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!solid }}
      accessibilityLabel={label}
      onPress={() => {
        tapLight();
        onPress();
      }}
      scaleTo={0.94}
      style={[style, styles.touch]}
    >
      {content}
    </PressableScale>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.chip, alignSelf: 'flex-start' },
  md: { paddingHorizontal: 14, paddingVertical: 8 },
  sm: { paddingHorizontal: 10, paddingVertical: 5 },
  touch: { minHeight: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
