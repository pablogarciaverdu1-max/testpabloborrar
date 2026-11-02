import { Check, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { colors, gutter, hit, radius, space } from '@/theme';
import { tapLight } from '@/utils/haptics';

import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

/** Grupo de filas estilo lista agrupada de iOS. */
export function Group({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.group}>
      {title ? (
        <Txt variant="footnoteStrong" color={colors.text2} style={styles.title}>
          {title.toUpperCase()}
        </Txt>
      ) : null}
      <View style={styles.card}>
        {items.map((child, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={styles.sep} /> : null}
            {child}
          </Fragment>
        ))}
      </View>
      {footer ? (
        <Txt variant="footnote" color={colors.text3} style={styles.footer}>
          {footer}
        </Txt>
      ) : null}
    </View>
  );
}

type RowProps = {
  label: string;
  detail?: string;
  value?: string;
  icon?: LucideIcon;
  iconBg?: string;
  onPress?: () => void;
  chevron?: boolean;
  checked?: boolean;
  destructive?: boolean;
  right?: ReactNode;
};

export function Row({ label, detail, value, icon: Icon, iconBg = colors.primarySoft, onPress, chevron, checked, destructive, right }: RowProps) {
  const content = (
    <>
      {Icon ? (
        <View style={[styles.icon, { backgroundColor: destructive ? colors.dangerSoft : iconBg }]}>
          <Icon size={18} color={destructive ? colors.dangerInk : colors.ink} />
        </View>
      ) : null}
      <View style={styles.flex}>
        <Txt variant="body" color={destructive ? colors.dangerInk : colors.ink}>
          {label}
        </Txt>
        {detail ? (
          <Txt variant="footnote" color={colors.text2}>
            {detail}
          </Txt>
        ) : null}
      </View>
      {value ? (
        <Txt variant="subhead" color={colors.text3}>
          {value}
        </Txt>
      ) : null}
      {right}
      {checked ? <Check size={20} color={colors.primary} strokeWidth={2.6} /> : null}
      {chevron ? <ChevronRight size={18} color={colors.text3} /> : null}
    </>
  );
  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <PressableScale
      accessibilityRole={checked !== undefined ? 'radio' : 'button'}
      accessibilityState={checked !== undefined ? { selected: checked } : undefined}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      scaleTo={0.99}
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={styles.row}
    >
      {content}
    </PressableScale>
  );
}

export function SwitchRow({ label, detail, value, onChange, icon, iconBg }: { label: string; detail?: string; value: boolean; onChange: (v: boolean) => void; icon?: LucideIcon; iconBg?: string }) {
  return (
    <Row
      label={label}
      detail={detail}
      icon={icon}
      iconBg={iconBg}
      right={
        <Switch
          accessibilityLabel={label}
          value={value}
          onValueChange={(v) => {
            tapLight();
            onChange(v);
          }}
          trackColor={{ true: colors.primary, false: colors.line }}
          ios_backgroundColor={colors.line}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  group: { gap: 6, paddingHorizontal: gutter },
  title: { paddingHorizontal: space.lg },
  footer: { paddingHorizontal: space.lg },
  card: { backgroundColor: colors.bg, borderRadius: radius.tile + 2, overflow: 'hidden' },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginLeft: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: hit + 8, paddingHorizontal: space.lg, paddingVertical: space.sm },
  icon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 1 },
});
