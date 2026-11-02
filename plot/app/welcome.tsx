import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { categories, colors, gutter, radius, space, type CategoryId } from '@/theme';

const collage: { label: string; cat: CategoryId; rotate: number; top: number; left: `${number}%` }[] = [
  { label: 'Vinilos', cat: 'music', rotate: -12, top: 8, left: '6%' },
  { label: 'Montaña', cat: 'sport', rotate: 8, top: 0, left: '52%' },
  { label: 'Vermut', cat: 'food', rotate: -4, top: 62, left: '30%' },
  { label: 'Costa Brava', cat: 'places', rotate: 14, top: 74, left: '62%' },
  { label: 'Cine', cat: 'culture', rotate: -16, top: 126, left: '4%' },
  { label: 'Running', cat: 'sport', rotate: 6, top: 136, left: '40%' },
  { label: 'Indie', cat: 'music', rotate: -8, top: 190, left: '66%' },
  { label: 'Ramen', cat: 'food', rotate: 10, top: 200, left: '16%' },
];

export default function Welcome() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={[styles.circle, { backgroundColor: categories.music.solid, top: -60, right: -70 }]} />
      <View style={[styles.circle, styles.circleSm, { backgroundColor: categories.food.solid, top: 330, left: -60 }]} />
      <View style={[styles.pill, { backgroundColor: categories.places.solid }]} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Txt variant="title2" color={colors.white} style={styles.logo} accessibilityRole="header" accessibilityLabel="PLOT">
          PLOT
        </Txt>
        <View style={styles.collage} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {collage.map((c, i) => (
            <Animated.View key={c.label} entering={FadeInUp.delay(80 + i * 45).duration(300)} style={[styles.chipPos, { top: c.top, left: c.left }]}>
              <View style={[styles.chip, { backgroundColor: categories[c.cat].solid, transform: [{ rotate: `${c.rotate}deg` }] }]}>
                <Txt variant="headline" color={colors.ink}>
                  {c.label}
                </Txt>
              </View>
            </Animated.View>
          ))}
        </View>
        <Animated.View entering={FadeInDown.delay(150).duration(300)} style={styles.copy}>
          <Txt variant="largeTitle" color={colors.white} style={styles.hero} maxFontSizeMultiplier={1.3}>
            Anti-swipe.
          </Txt>
          <Txt variant="body" color={colors.white}>
            Aquí no deslizas a nadie. Ves lo que le gusta a la gente y le escribes.
          </Txt>
        </Animated.View>
        <View style={styles.actions}>
          <Button label="Crear cuenta" variant="light" onPress={() => router.push('/onboarding')} />
          <Button label="Ya tengo cuenta" variant="dark" onPress={() => router.push('/login')} />
          <View style={styles.legal}>
            <Txt variant="footnote" color={colors.white} align="center">
              Al continuar aceptas las{' '}
              <Txt
                variant="footnoteStrong"
                color={colors.white}
                style={styles.link}
                accessibilityRole="link"
                onPress={() => router.push({ pathname: '/legal', params: { tab: 'terms' } })}
              >
                Condiciones
              </Txt>{' '}
              y la{' '}
              <Txt
                variant="footnoteStrong"
                color={colors.white}
                style={styles.link}
                accessibilityRole="link"
                onPress={() => router.push({ pathname: '/legal', params: { tab: 'privacy' } })}
              >
                Política de privacidad
              </Txt>
              .
            </Txt>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, overflow: 'hidden' },
  safe: { flex: 1, paddingHorizontal: gutter },
  logo: { marginTop: space.sm, letterSpacing: 2 },
  circle: { position: 'absolute', width: 220, height: 220, borderRadius: 110, opacity: 0.9 },
  circleSm: { width: 140, height: 140, borderRadius: 70 },
  pill: { position: 'absolute', width: 200, height: 70, borderRadius: 999, right: -70, top: 360, transform: [{ rotate: '-24deg' }], opacity: 0.85 },
  collage: { height: 250, marginTop: space.xl },
  chipPos: { position: 'absolute' },
  chip: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: radius.chip },
  copy: { flex: 1, justifyContent: 'flex-end', gap: space.sm, paddingBottom: space.xl },
  hero: { fontSize: 52, lineHeight: 56 },
  actions: { gap: space.md, paddingBottom: space.sm },
  legal: { paddingTop: space.xs, paddingHorizontal: space.lg },
  link: { textDecorationLine: 'underline' },
});
