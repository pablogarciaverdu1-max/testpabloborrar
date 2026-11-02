import { Check } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { appInfo } from '@/data/catalog';
import { colors, hit, radius, space } from '@/theme';
import type { AppId } from '@/types';

import { AppGlyph } from './AppGlyph';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Props = { app: AppId; connected: boolean; connecting?: boolean; onPress: () => void };

/** Fila de app conectable: «Conectar» → spinner 1 s → «Conectado ✓». */
export function AppConnectRow({ app, connected, connecting, onPress }: Props) {
  const info = appInfo[app];
  return (
    <View style={styles.row}>
      <AppGlyph app={app} />
      <View style={styles.flex}>
        <Txt variant="headline">{info.name}</Txt>
        <Txt variant="footnote" color={colors.text2}>
          {info.description}
        </Txt>
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={connected ? `${info.name} conectado. Toca para desconectar` : `Conectar ${info.name}`}
        accessibilityState={{ busy: !!connecting }}
        onPress={onPress}
        style={[styles.btn, connected ? styles.btnOn : styles.btnOff]}
      >
        {connecting ? (
          <ActivityIndicator color={colors.primary} />
        ) : connected ? (
          <View style={styles.inline}>
            <Txt variant="subheadStrong" color={colors.ink}>
              Conectado
            </Txt>
            <Check size={16} color={colors.ink} strokeWidth={2.6} />
          </View>
        ) : (
          <Txt variant="subheadStrong" color={colors.white}>
            Conectar
          </Txt>
        )}
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  flex: { flex: 1, gap: 2 },
  btn: { minHeight: hit - 6, minWidth: 116, paddingHorizontal: space.md, borderRadius: radius.chip, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: colors.primary },
  btnOn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
