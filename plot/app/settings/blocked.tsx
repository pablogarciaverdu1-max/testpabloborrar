import { Ban } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Group } from '@/components/Group';
import { Txt } from '@/components/Txt';
import { personById } from '@/store/selectors';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { colors, space } from '@/theme';

export default function Blocked() {
  const blocked = useApp((s) => s.blocked);
  const unblock = useApp((s) => s.unblock);
  const block = useApp((s) => s.block);

  if (blocked.length === 0) {
    return (
      <EmptyState icon={Ban} title="No has bloqueado a nadie" text="Si bloqueas a alguien desde su perfil o un chat, aparecerá aquí." />
    );
  }
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scroll}>
      <Group footer="Las personas bloqueadas no pueden escribirte ni ver tu perfil. No saben que las has bloqueado.">
        {blocked.map((id) => {
          const p = personById(id);
          if (!p) return null;
          return (
            <View key={id} style={styles.row}>
              <Avatar photoId={p.id} name={p.name} color={p.color} size={40} />
              <View style={styles.flex}>
                <Txt variant="headline">{p.name}</Txt>
                <Txt variant="footnote" color={colors.text2}>
                  {p.hood}
                </Txt>
              </View>
              <Button
                label="Desbloquear"
                variant="secondary"
                size="sm"
                onPress={() => {
                  unblock(id);
                  toast(`${p.name} desbloqueada`, { undo: () => block(id) });
                }}
              />
            </View>
          );
        })}
      </Group>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
  flex: { flex: 1 },
});
