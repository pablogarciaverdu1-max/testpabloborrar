import { useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius, space } from '@/theme';

import { Txt } from './Txt';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  right?: ReactNode;
  left?: ReactNode;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

/** Campo de texto con label, foco violeta y mensaje de error. */
export function Input({ label, error, hint, right, left, style, onFocus, onBlur, multiline, ref, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.line;
  return (
    <View style={styles.wrap}>
      {label ? (
        <Txt variant="footnoteStrong" color={colors.text2}>
          {label}
        </Txt>
      ) : null}
      <View
        style={[
          styles.field,
          { borderColor, backgroundColor: focused ? colors.bg : colors.surface },
          multiline && styles.multiline,
        ]}
      >
        {left ? <View style={styles.adorn}>{left}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.text3}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          multiline={multiline}
          maxFontSizeMultiplier={1.8}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          {...rest}
        />
        {right ? <View style={styles.adorn}>{right}</View> : null}
      </View>
      {error ? (
        <Txt variant="footnoteStrong" color={colors.dangerInk} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Txt>
      ) : hint ? (
        <Txt variant="footnote" color={colors.text3}>
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  adorn: { flexShrink: 0 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: radius.input,
    paddingHorizontal: space.md,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: space.sm },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 17, color: colors.ink, paddingVertical: 12 },
  inputMultiline: { minHeight: 96, textAlignVertical: 'top', paddingTop: 6 },
});
