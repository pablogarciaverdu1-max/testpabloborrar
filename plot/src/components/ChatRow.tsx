import { BellOff, Trash } from 'lucide-react-native';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { categoryOf } from '@/data/catalog';
import { categories, colors, fonts, gutter, space } from '@/theme';
import type { Conversation, Person } from '@/types';
import { tapLight } from '@/utils/haptics';
import { messagePreview } from '@/utils/messages';
import { shortTime } from '@/utils/time';

import { Avatar } from './Avatar';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Props = {
  person: Person;
  conversation: Conversation;
  common: string[];
  onPress: () => void;
  onMute: () => void;
  onDelete: () => void;
};

/** Fila de conversación. Deslizar a la izquierda muestra «Silenciar» y «Eliminar». */
export function ChatRow({ person, conversation, common, onPress, onMute, onDelete }: Props) {
  const ref = useRef<SwipeableMethods>(null);
  const last = conversation.messages[conversation.messages.length - 1];
  const mine = last?.from === 'me';
  const unread = conversation.unread > 0;
  const first = common[0];
  const cat = first ? categories[categoryOf(first)] : undefined;

  const actions = () => (
    <View style={styles.actions}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={conversation.muted ? 'Activar sonido' : 'Silenciar'}
        onPress={() => {
          tapLight();
          ref.current?.close();
          onMute();
        }}
        style={[styles.action, { backgroundColor: colors.text2 }]}
      >
        <BellOff size={20} color={colors.white} />
        <Txt variant="caption" color={colors.white}>
          {conversation.muted ? 'Activar' : 'Silenciar'}
        </Txt>
      </PressableScale>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Eliminar"
        onPress={() => {
          tapLight();
          ref.current?.close();
          onDelete();
        }}
        style={[styles.action, { backgroundColor: colors.danger }]}
      >
        <Trash size={20} color={colors.white} />
        <Txt variant="caption" color={colors.white}>
          Eliminar
        </Txt>
      </PressableScale>
    </View>
  );

  return (
    <ReanimatedSwipeable ref={ref} renderRightActions={actions} overshootRight={false} friction={1.6} rightThreshold={40}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${person.name}. ${unread ? `${conversation.unread} sin leer. ` : ''}${mine ? 'Tú: ' : ''}${last ? messagePreview(last) : ''}`}
        accessibilityHint="Desliza a la izquierda para silenciar o eliminar"
        accessibilityActions={[
          { name: 'mute', label: conversation.muted ? 'Activar sonido' : 'Silenciar' },
          { name: 'delete', label: 'Eliminar' },
        ]}
        onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'mute' ? onMute() : onDelete())}
        onPress={onPress}
        scaleTo={0.99}
        style={styles.row}
      >
        <Avatar photoId={person.id} name={person.name} color={person.color} size={56} verified={person.verified} />
        <View style={styles.flex}>
          <View style={styles.top}>
            <View style={styles.nameRow}>
              <Txt variant="headline" numberOfLines={1} style={styles.shrink}>
                {person.name}
              </Txt>
              {conversation.muted ? <BellOff size={14} color={colors.text3} accessibilityLabel="Silenciada" /> : null}
            </View>
            {last ? (
              <Txt variant="footnote" color={unread ? colors.primaryInk : colors.text3}>
                {shortTime(last.createdAt)}
              </Txt>
            ) : null}
          </View>
          <View style={styles.top}>
            <Txt variant="subhead" color={unread ? colors.ink : colors.text2} numberOfLines={1} style={[styles.shrink, unread && styles.bold]}>
              {mine ? 'Tú: ' : ''}
              {last ? messagePreview(last) : ''}
            </Txt>
            {unread ? <View style={[styles.dot, conversation.muted && { backgroundColor: colors.text3 }]} accessibilityLabel="Sin leer" /> : null}
          </View>
          {first && cat ? (
            <Txt variant="footnoteStrong" color={cat.ink} numberOfLines={1}>
              Os une: {common.slice(0, 2).join(' · ')}
            </Txt>
          ) : null}
        </View>
      </PressableScale>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: gutter, paddingVertical: space.md, backgroundColor: colors.bg },
  flex: { flex: 1, gap: 2 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  shrink: { flexShrink: 1 },
  bold: { fontFamily: fonts.semibold },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  actions: { flexDirection: 'row' },
  action: { width: 84, alignItems: 'center', justifyContent: 'center', gap: 4 },
});
