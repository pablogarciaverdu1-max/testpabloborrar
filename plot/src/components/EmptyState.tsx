import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, space } from '@/theme';

import { Button } from './Button';
import { Txt } from './Txt';

type Props = { icon: LucideIcon; title: string; text: string; actionLabel?: string; onAction?: () => void };

export function EmptyState({ icon: Icon, title, text, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Icon size={30} color={colors.primary} />
      </View>
      <Txt variant="title2" align="center">
        {title}
      </Txt>
      <Txt variant="subhead" color={colors.text2} align="center">
        {text}
      </Txt>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} variant="secondary" size="md" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.md, paddingVertical: space.xxxl, paddingHorizontal: space.xl },
  icon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});
