import { CircleCheck, Info, TriangleAlert } from 'lucide-react-native';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/store/useToast';
import { colors, gutter, radius, space } from '@/theme';
import { tapLight } from '@/utils/haptics';

import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

/** Toast global con opción «Deshacer». Aparece arriba, bajo la Dynamic Island, sin tapar botones. */
export function ToastHost() {
  const t = useToast((s) => s.toast);
  const hide = useToast((s) => s.hide);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!t) return;
    AccessibilityInfo.announceForAccessibility(t.message);
    const timer = setTimeout(hide, t.undo ? 4500 : 2600);
    return () => clearTimeout(timer);
  }, [t, hide]);

  if (!t) return null;
  const Icon = t.tone === 'danger' ? TriangleAlert : t.tone === 'success' ? CircleCheck : Info;
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 6 }]}>
      <Animated.View key={t.id} entering={FadeInUp.duration(220)} exiting={FadeOutUp.duration(200)} style={styles.toast}>
        <Icon size={20} color={t.tone === 'danger' ? colors.dangerSoft : colors.white} />
        <Txt variant="subheadStrong" color={colors.white} style={styles.msg}>
          {t.message}
        </Txt>
        {t.undo ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Deshacer"
            onPress={() => {
              tapLight();
              t.undo?.();
              hide();
            }}
            style={styles.undo}
          >
            <Txt variant="subheadStrong" color={colors.primarySoft}>
              Deshacer
            </Txt>
          </PressableScale>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: gutter, right: gutter, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.ink,
    borderRadius: radius.button,
    paddingLeft: space.lg,
    paddingRight: space.sm,
    minHeight: 52,
    width: '100%',
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  msg: { flex: 1, paddingVertical: space.md },
  undo: { minHeight: 44, paddingHorizontal: space.md, justifyContent: 'center' },
});
