import { Text, type TextProps } from 'react-native';

import { colors, type as typeScale, type TypeVariant } from '@/theme';

export type TxtProps = TextProps & {
  variant?: TypeVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
};

/** Texto con la escala tipográfica del sistema. Soporta Dynamic Type. */
export function Txt({ variant = 'body', color = colors.ink, align, style, maxFontSizeMultiplier, ...rest }: TxtProps) {
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? (variant === 'largeTitle' || variant === 'title1' ? 1.4 : 1.8)}
      style={[typeScale[variant], { color }, align ? { textAlign: align } : null, style]}
      {...rest}
    />
  );
}
