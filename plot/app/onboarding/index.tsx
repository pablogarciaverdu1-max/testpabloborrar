import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Chip, ChipRow } from '@/components/Chip';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Txt } from '@/components/Txt';
import { interestCatalog } from '@/data/catalog';
import { useApp } from '@/store/useApp';
import { useOnboarding } from '@/store/useOnboarding';
import { categories, categoryOrder, colors, gutter, space } from '@/theme';

const MIN = 5;

export default function Interests() {
  const selected = useOnboarding((s) => s.interests);
  const toggle = useOnboarding((s) => s.toggle);
  const updateMe = useApp((s) => s.updateMe);
  const missing = Math.max(0, MIN - selected.length);
  const counter =
    missing > 0
      ? `${selected.length} de ${MIN} elegidos · te ${missing === 1 ? 'falta' : 'faltan'} ${missing}`
      : `${selected.length} elegidos · ¡listo!`;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <OnboardingHeader step={1} />
      <ScrollView contentContainerStyle={styles.body}>
        <Txt variant="largeTitle" accessibilityRole="header">
          ¿Qué te mueve?
        </Txt>
        <Txt variant="body" color={colors.text2}>
          Elige al menos 5 cosas. Así te enseñamos gente que comparte lo que te gusta.
        </Txt>
        {categoryOrder.map((cat) => (
          <View key={cat} style={styles.section}>
            <View style={styles.sectionTitle}>
              <View style={[styles.dot, { backgroundColor: categories[cat].solid }]} />
              <Txt variant="headline">{categories[cat].label}</Txt>
            </View>
            <ChipRow>
              {interestCatalog[cat].map((label) => (
                <Chip key={label} label={label} category={cat} solid={selected.includes(label)} showCheck onPress={() => toggle(label)} />
              ))}
            </ChipRow>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Txt variant="subheadStrong" color={missing > 0 ? colors.text2 : colors.primaryInk} align="center" accessibilityLiveRegion="polite">
          {counter}
        </Txt>
        <Button
          label="Continuar"
          disabled={missing > 0}
          onPress={() => {
            updateMe({ interests: selected });
            router.push('/onboarding/apps');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: gutter, paddingTop: space.md, paddingBottom: space.xl, gap: space.md },
  section: { gap: space.md, marginTop: space.md },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
  footer: { paddingHorizontal: gutter, paddingTop: space.md, paddingBottom: space.md, gap: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
