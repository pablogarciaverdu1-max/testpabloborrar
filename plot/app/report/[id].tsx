import { router, useLocalSearchParams } from 'expo-router';
import { Check, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { PressableScale } from '@/components/PressableScale';
import { Txt } from '@/components/Txt';
import { personById } from '@/store/selectors';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { colors, gutter, hit, radius, space } from '@/theme';
import { confirm } from '@/utils/confirm';
import { notifySuccess, tapLight, tapMedium } from '@/utils/haptics';

const reasons = ['Spam', 'Acoso', 'Perfil falso', 'Contenido inapropiado', 'Otro'];

export default function Report() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = personById(id);
  const insets = useSafeAreaInsets();
  const block = useApp((s) => s.block);
  const isBlocked = useApp((s) => s.blocked.includes(id));
  const [reason, setReason] = useState<string>();
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!person) return null;

  if (sent) {
    return (
      <View style={[styles.root, styles.thanks, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
        <Animated.View entering={ZoomIn.duration(260)} style={styles.badge}>
          <ShieldCheck size={40} color={colors.white} />
        </Animated.View>
        <Txt variant="title1" align="center" accessibilityRole="header">
          Gracias por avisarnos
        </Txt>
        <Txt variant="body" color={colors.text2} align="center">
          Revisaremos el perfil de {person.name} en las próximas 24 horas. {person.name} no sabrá que lo has reportado.
        </Txt>
        <View style={styles.thanksActions}>
          {!isBlocked ? (
            <Button
              label={`Bloquear también a ${person.name}`}
              variant="danger"
              onPress={() =>
                confirm({
                  title: `¿Bloquear a ${person.name}?`,
                  message: 'Desaparecerá de tus chats y de Descubrir.',
                  confirmText: 'Bloquear',
                  destructive: true,
                  onConfirm: () => {
                    block(id);
                    notifySuccess();
                    router.dismissAll();
                    router.navigate('/discover');
                    toast(`Has bloqueado a ${person.name}`);
                  },
                })
              }
            />
          ) : null}
          <Button label="Listo" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Txt variant="title1" accessibilityRole="header">
          Reportar a {person.name}
        </Txt>
        <Txt variant="subhead" color={colors.text2}>
          ¿Qué ha pasado? Tu reporte es anónimo.
        </Txt>
        <View style={styles.reasons} accessibilityRole="radiogroup">
          {reasons.map((r) => {
            const on = reason === r;
            return (
              <PressableScale
                key={r}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={r}
                onPress={() => {
                  tapLight();
                  setReason(r);
                }}
                style={[styles.reason, { borderColor: on ? colors.primary : colors.line, backgroundColor: on ? colors.primarySoft : colors.bg }]}
                scaleTo={0.99}
              >
                <Txt variant="headline" style={styles.flex}>
                  {r}
                </Txt>
                <View style={[styles.radio, on && styles.radioOn]}>{on ? <Check size={14} color={colors.white} strokeWidth={3} /> : null}</View>
              </PressableScale>
            );
          })}
        </View>
        <Input label="Comentario (opcional)" value={comment} onChangeText={(t) => setComment(t.slice(0, 300))} multiline placeholder="Cuéntanos más si quieres" hint={`${comment.length}/300`} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
        <Button label="Cancelar" variant="secondary" flex onPress={() => router.back()} />
        <Button
          label="Enviar"
          flex
          disabled={!reason}
          loading={sending}
          onPress={() => {
            tapMedium();
            setSending(true);
            setTimeout(() => {
              notifySuccess();
              setSending(false);
              setSent(true);
            }, 900);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: gutter, paddingTop: space.xl, gap: space.md, paddingBottom: space.xl },
  reasons: { gap: space.sm, marginTop: space.sm },
  reason: { flexDirection: 'row', alignItems: 'center', minHeight: hit + 8, paddingHorizontal: space.lg, borderRadius: radius.button, borderWidth: 1.5 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  flex: { flex: 1 },
  footer: { flexDirection: 'row', gap: space.sm, paddingHorizontal: gutter, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  thanks: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: gutter, gap: space.md },
  badge: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  thanksActions: { alignSelf: 'stretch', gap: space.sm, marginTop: space.xl },
});
