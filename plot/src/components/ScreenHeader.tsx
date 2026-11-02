import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, gutter, space } from '@/theme';

import { Txt } from './Txt';

/** Cabecera con large title estilo iOS y acciones a la derecha. */
export function LargeHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.flex}>
        <Txt variant="largeTitle" accessibilityRole="header">
          {title}
        </Txt>
        {subtitle ? (
          <Txt variant="subhead" color={colors.text2}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: gutter, paddingTop: space.sm, paddingBottom: space.md, gap: space.md },
  flex: { flex: 1 },
  right: { flexDirection: 'row', gap: space.sm, paddingBottom: 2 },
});
