import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppConnectRow } from '@/components/AppConnectRow';
import { Button } from '@/components/Button';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { Txt } from '@/components/Txt';
import { appOrder } from '@/data/catalog';
import { colors, gutter, radius, space } from '@/theme';
import { useAppConnection } from '@/utils/useAppConnection';

export default function ConnectApps() {
  const { apps, connecting, toggle } = useAppConnection();
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <OnboardingHeader step={2} />
      <ScrollView contentContainerStyle={styles.body}>
        <Txt variant="largeTitle" accessibilityRole="header">
          Conecta tus apps
        </Txt>
        <Txt variant="body" color={colors.text2}>
          Comparte lo que escuchas, tus rutas y tus sitios. Tú decides qué se publica.
        </Txt>
        <View style={styles.card}>
          {appOrder.map((app) => (
            <AppConnectRow key={app} app={app} connected={apps[app]} connecting={connecting[app]} onPress={() => toggle(app)} />
          ))}
        </View>
        <Txt variant="footnote" color={colors.text3}>
          Puedes cambiarlo cuando quieras en Ajustes › Apps conectadas.
        </Txt>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Continuar" onPress={() => router.push('/onboarding/ready')} />
        <Button label="Ahora no" variant="text" onPress={() => router.push('/onboarding/ready')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: gutter, paddingTop: space.md, paddingBottom: space.xl, gap: space.md },
  card: { borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: space.lg, marginTop: space.md },
  footer: { paddingHorizontal: gutter, paddingBottom: space.sm, gap: space.xs },
});
