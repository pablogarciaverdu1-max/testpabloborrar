import { StyleSheet } from 'react-native';

import { colors, hit, space } from '@/theme';
import { tapLight } from '@/utils/haptics';

import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

/** Acción de texto para barras de navegación de modales (Cancelar / Guardar). */
export function TextAction({ label, onPress, strong, disabled }: { label: string; onPress: () => void; strong?: boolean; disabled?: boolean }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={styles.action}
    >
      <Txt variant={strong ? 'headline' : 'body'} color={disabled ? colors.text3 : colors.primary}>
        {label}
      </Txt>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  action: { minHeight: hit, minWidth: hit, paddingHorizontal: space.sm, justifyContent: 'center' },
});
