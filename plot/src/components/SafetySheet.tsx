import { router } from 'expo-router';
import { Ban, Bell, BellOff, Flag, X, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { personById } from '@/store/selectors';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { colors, hit, radius, space } from '@/theme';
import { confirm } from '@/utils/confirm';
import { notifySuccess, tapLight } from '@/utils/haptics';

import { BottomSheet } from './BottomSheet';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Props = {
  personId: string;
  visible: boolean;
  onClose: () => void;
  /** Se llama tras bloquear (p. ej. para salir de la pantalla). */
  onBlocked?: () => void;
};

/** Menú de seguridad: silenciar, bloquear, reportar o cancelar. */
export function SafetySheet({ personId, visible, onClose, onBlocked }: Props) {
  const person = personById(personId);
  const muted = useApp((s) => s.conversations[personId]?.muted ?? false);
  const setMuted = useApp((s) => s.setMuted);
  const block = useApp((s) => s.block);
  const unblock = useApp((s) => s.unblock);
  if (!person) return null;

  const onMute = () => {
    const next = !muted;
    setMuted(personId, next);
    onClose();
    toast(next ? `Conversación con ${person.name} silenciada` : `Conversación con ${person.name} activada`, {
      undo: () => setMuted(personId, !next),
    });
  };

  const onBlock = () => {
    onClose();
    setTimeout(() => {
      confirm({
        title: `¿Bloquear a ${person.name}?`,
        message: `${person.name} no podrá escribirte ni ver tu perfil. Desaparecerá de tus chats y de Descubrir. No le avisaremos.`,
        confirmText: 'Bloquear',
        destructive: true,
        onConfirm: () => {
          block(personId);
          notifySuccess();
          onBlocked?.();
          toast(`Has bloqueado a ${person.name}`, { undo: () => unblock(personId) });
        },
      });
    }, 320);
  };

  const onReport = () => {
    onClose();
    setTimeout(() => router.push({ pathname: '/report/[id]', params: { id: personId } }), 280);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={person.name} subtitle="Tu seguridad es lo primero. Nadie sabrá lo que elijas aquí.">
      <View style={styles.list}>
        <Option icon={muted ? Bell : BellOff} label={muted ? 'Activar conversación' : 'Silenciar conversación'} onPress={onMute} />
        <Option icon={Ban} label={`Bloquear a ${person.name}`} danger onPress={onBlock} />
        <Option icon={Flag} label="Reportar" danger onPress={onReport} />
        <Option icon={X} label="Cancelar" onPress={onClose} muted />
      </View>
    </BottomSheet>
  );
}

function Option({ icon: Icon, label, onPress, danger, muted }: { icon: LucideIcon; label: string; onPress: () => void; danger?: boolean; muted?: boolean }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={[styles.option, { backgroundColor: danger ? colors.dangerSoft : colors.surface }]}
    >
      <Icon size={20} color={danger ? colors.dangerInk : muted ? colors.text2 : colors.ink} />
      <Txt variant="headline" color={danger ? colors.dangerInk : muted ? colors.text2 : colors.ink}>
        {label}
      </Txt>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm, paddingTop: space.xs },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: hit + 10, paddingHorizontal: space.lg, borderRadius: radius.button },
});
