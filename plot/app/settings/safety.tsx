import { Coffee, Eye, MapPin, MessageCircle, Phone, ShieldCheck, type LucideIcon } from 'lucide-react-native';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Txt } from '@/components/Txt';
import { toast } from '@/store/useToast';
import { categories, colors, gutter, radius, space, type CategoryId } from '@/theme';

const tips: { icon: LucideIcon; cat: CategoryId; title: string; text: string }[] = [
  { icon: Coffee, cat: 'food', title: 'Queda en un sitio público', text: 'Una cafetería, un parque o un bar con gente. Evita casas la primera vez.' },
  { icon: Phone, cat: 'culture', title: 'Avisa a alguien de confianza', text: 'Cuéntale dónde vas, con quién y a qué hora piensas volver.' },
  { icon: MapPin, cat: 'places', title: 'Ve y vuelve por tu cuenta', text: 'Así decides tú cuándo irte, sin depender de nadie.' },
  { icon: MessageCircle, cat: 'music', title: 'Habla antes en PLOT', text: 'Conocerse un poco por chat ayuda a saber si os apetece quedar.' },
  { icon: Eye, cat: 'sport', title: 'Confía en tu instinto', text: 'Si algo no te encaja, vete. Puedes bloquear y reportar en cualquier momento.' },
];

const SUPPORT = 'mailto:soporte@plot.app?subject=Ayuda%20con%20PLOT';

export default function SafetyCenter() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <ShieldCheck size={28} color={colors.white} />
        <Txt variant="title2" color={colors.white}>
          Consejos para quedar por primera vez
        </Txt>
        <Txt variant="subhead" color={colors.white}>
          En PLOT nadie puede escribirte en Conversaciones sin que tú respondas antes.
        </Txt>
      </View>
      {tips.map((t) => {
        const Icon = t.icon;
        return (
          <View key={t.title} style={styles.tip}>
            <View style={[styles.icon, { backgroundColor: categories[t.cat].solid }]}>
              <Icon size={20} color={colors.ink} />
            </View>
            <View style={styles.flex}>
              <Txt variant="headline">{t.title}</Txt>
              <Txt variant="subhead" color={colors.text2}>
                {t.text}
              </Txt>
            </View>
          </View>
        );
      })}
      <Button
        label="Contactar con soporte"
        variant="dark"
        onPress={() => {
          Linking.openURL(SUPPORT).catch(() => toast('No hay ninguna app de correo configurada', { tone: 'danger' }));
        }}
      />
      <Txt variant="footnote" color={colors.text3} align="center">
        Si estás en peligro, llama al 112.
      </Txt>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: gutter, gap: space.md, paddingBottom: space.xxxl },
  hero: { backgroundColor: colors.primary, borderRadius: radius.card, padding: space.lg, gap: space.sm },
  tip: { flexDirection: 'row', gap: space.md, backgroundColor: colors.bg, borderRadius: radius.card, padding: space.lg },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
});
