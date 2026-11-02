import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, hit, radius, space } from '@/theme';
import { tapLight } from '@/utils/haptics';

import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'text' | 'danger' | 'light';

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  size?: 'md' | 'lg' | 'sm';
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  haptic?: boolean;
  flex?: boolean;
};

const palette: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  secondary: { bg: colors.primarySoft, fg: colors.primaryInk },
  dark: { bg: colors.ink, fg: colors.white },
  text: { bg: colors.transparent, fg: colors.primaryInk },
  danger: { bg: colors.dangerSoft, fg: colors.dangerInk },
  light: { bg: colors.white, fg: colors.primaryInk },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon: Icon,
  size = 'lg',
  style,
  accessibilityHint,
  haptic = true,
  flex,
}: Props) {
  const p = palette[variant];
  const inactive = disabled || loading;
  const height = size === 'lg' ? 54 : size === 'md' ? 46 : hit;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        if (haptic) tapLight();
        onPress();
      }}
      style={[
        styles.base,
        {
          minHeight: height,
          backgroundColor: disabled ? colors.line : p.bg,
          paddingHorizontal: variant === 'text' ? space.sm : size === 'sm' ? space.lg : space.xl,
          borderRadius: size === 'lg' ? radius.button + 1 : radius.button - 1,
        },
        flex && styles.flex,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.row}>
          {Icon ? <Icon size={size === 'sm' ? 16 : 19} color={disabled ? colors.text3 : p.fg} /> : null}
          <Txt variant={size === 'sm' ? 'subheadStrong' : 'headline'} color={disabled ? colors.text3 : p.fg} align="center" style={styles.label}>
            {label}
          </Txt>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', paddingVertical: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, justifyContent: 'center', maxWidth: '100%' },
  label: { flexShrink: 1 },
  flex: { flex: 1 },
});
