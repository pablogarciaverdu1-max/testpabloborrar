import { StyleSheet, View } from 'react-native';

import { categories, type CategoryId } from '@/theme';

type Shape = {
  kind: 'circle' | 'pill';
  cat: CategoryId;
  size: number;
  top?: number | `${number}%`;
  left?: number | `${number}%`;
  right?: number | `${number}%`;
  bottom?: number | `${number}%`;
  rotate?: number;
  soft?: boolean;
};

/** Formas decorativas de color (círculos y pills giradas). Solo decoración. */
export function Decor({ shapes }: { shapes: Shape[] }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {shapes.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            width: s.kind === 'pill' ? s.size * 2.4 : s.size,
            height: s.size,
            borderRadius: 999,
            backgroundColor: s.soft ? categories[s.cat].soft : categories[s.cat].solid,
            transform: [{ rotate: `${s.rotate ?? 0}deg` }],
          }}
        />
      ))}
    </View>
  );
}

