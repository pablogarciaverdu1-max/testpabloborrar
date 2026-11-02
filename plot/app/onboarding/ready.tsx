import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppGlyph } from '@/components/AppGlyph';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Chip, ChipRow } from '@/components/Chip';
import { Decor } from '@/components/Decor';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Txt } from '@/components/Txt';
import { appInfo, appOrder } from '@/data/catalog';
import { people } from '@/data/seed';
import { shared } from '@/store/selectors';
import { useApp } from '@/store/useApp';
import { useOnboarding } from '@/store/useOnboarding';
import { colors, gutter, radius, space } from '@/theme';
import { notifySuccess } from '@/utils/haptics';

export default function Ready() {
  const me = useApp((s) => s.me);
  const apps = useApp((s) => s.apps);
  const complete = useApp((s) => s.completeOnboarding);
  const resetDraft = useOnboarding((s) => s.reset);
  const candidates = people.filter((p) => !p.hiddenFromDiscover);
  const three = candidates.filter((p) => shared(me.interests, p.interests).length >= 3).length;
  const any = candidates.filter((p) => shared(me.interests, p.interests).length >= 1).length;
  const connected = appOrder.filter((a) => apps[a]);

  const message =
    three > 0
      ? `Ya hay ${three} ${three === 1 ? 'persona' : 'personas'} cerca con 3 intereses en común`
      : `Ya hay ${any} ${any === 1 ? 'persona' : 'personas'} cerca con intereses en común`;

  const finish = (thenCompose: boolean) => {
    notifySuccess();
    complete();
    resetDraft();
    router.replace('/discover');
    if (thenCompose) setTimeout(() => router.push('/compose'), 350);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Decor
        shapes={[
          { kind: 'circle', cat: 'music', size: 180, top: -40, right: -60 },
          { kind: 'pill', cat: 'places', size: 54, top: 150, left: -40, rotate: -20 },
          { kind: 'circle', cat: 'food', size: 90, bottom: 210, right: -24 },
          { kind: 'pill', cat: 'culture', size: 40, bottom: 160, left: 30, rotate: 18, soft: true },
        ]}
      />
      <OnboardingHeader step={3} />
      <ScrollView contentContainerStyle={styles.body}>
        <Txt variant="largeTitle" accessibilityRole="header">
          Tu perfil está listo
        </Txt>
        <Animated.View entering={ZoomIn.duration(280)} style={styles.card}>
          <View style={styles.head}>
            <Avatar photoId="me" name={me.name} color={me.color} size={56} />
            <View style={styles.flex}>
              <Txt variant="title2">
                {me.name}, {me.age}
              </Txt>
              <Txt variant="subhead" color={colors.text2}>
                {me.hood}, Barcelona
              </Txt>
            </View>
          </View>
          <ChipRow>
            {me.interests.map((i) => (
              <Chip key={i} label={i} solid size="sm" />
            ))}
          </ChipRow>
          <View style={styles.apps}>
            {connected.length ? (
              connected.map((a) => (
                <View key={a} style={styles.appItem}>
                  <AppGlyph app={a} size={28} />
                  <Txt variant="footnoteStrong">{appInfo[a].name}</Txt>
                </View>
              ))
            ) : (
              <Txt variant="footnote" color={colors.text3}>
                Sin apps conectadas por ahora
              </Txt>
            )}
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(160).duration(260)} style={styles.banner}>
          <Txt variant="headline" color={colors.white}>
            {message}
          </Txt>
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Empezar a descubrir" onPress={() => finish(false)} />
        <Button label="Hacer mi primera publicación" variant="secondary" onPress={() => finish(true)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  body: { paddingHorizontal: gutter, paddingTop: space.md, gap: space.lg, paddingBottom: space.xl },
  card: { backgroundColor: colors.bg, borderRadius: radius.cardLg, borderWidth: 1, borderColor: colors.line, padding: space.lg, gap: space.lg, shadowColor: colors.ink, shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  flex: { flex: 1 },
  apps: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  appItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  banner: { backgroundColor: colors.primary, borderRadius: radius.card, padding: space.lg },
  footer: { paddingHorizontal: gutter, paddingBottom: space.sm, gap: space.sm },
});
