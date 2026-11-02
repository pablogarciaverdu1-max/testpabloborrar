import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Compass, MessageCircle, Plus, User, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChatBadge } from '@/store/selectors';
import { colors, hit, space } from '@/theme';
import { tapLight, tapMedium } from '@/utils/haptics';

import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

const meta: Record<string, { label: string; icon: LucideIcon }> = {
  discover: { label: 'Descubrir', icon: Compass },
  publish: { label: 'Publicar', icon: Plus },
  chats: { label: 'Chats', icon: MessageCircle },
  profile: { label: 'Perfil', icon: User },
};

/** Barra de pestañas propia: «Publicar» abre el modal en lugar de navegar. */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const badge = useChatBadge();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.sm) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const m = meta[route.name];
        if (!m) return null;
        const focused = state.index === index;
        const Icon = m.icon;
        if (route.name === 'publish') {
          return (
            <PressableScale
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel="Publicar"
              accessibilityHint="Abre el formulario para crear una publicación"
              onPress={() => {
                tapMedium();
                router.push('/compose');
              }}
              style={styles.item}
              scaleTo={0.9}
            >
              <View style={styles.publish}>
                <Plus size={24} color={colors.white} strokeWidth={2.4} />
              </View>
              <Txt variant="caption" color={colors.text2} maxFontSizeMultiplier={1.2}>
                {m.label}
              </Txt>
            </PressableScale>
          );
        }
        const showBadge = route.name === 'chats' && badge > 0;
        return (
          <PressableScale
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={showBadge ? `${m.label}, ${badge} pendientes` : m.label}
            onPress={() => {
              if (!focused) {
                tapLight();
                navigateToTab(route.key);
              }
            }}
            style={styles.item}
            scaleTo={0.92}
          >
            <View>
              <Icon size={26} color={focused ? colors.primary : colors.text3} strokeWidth={focused ? 2.2 : 1.8} />
              {showBadge ? (
                <View style={styles.badge}>
                  <Txt variant="caption" color={colors.white} maxFontSizeMultiplier={1.1}>
                    {badge > 99 ? '99+' : badge}
                  </Txt>
                </View>
              ) : null}
            </View>
            <Txt variant="caption" color={focused ? colors.primaryInk : colors.text3} maxFontSizeMultiplier={1.2}>
              {m.label}
            </Txt>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: 6,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: hit + 6 },
  publish: { width: 44, height: 32, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
