import { CornerDownRight, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { questionById } from '@/data/flirt';
import { categories, colors, radius, space } from '@/theme';
import type { Message, Post } from '@/types';
import { clock } from '@/utils/time';

import { ActivityCard, PlaceCard, SongCard } from './MediaCards';
import { PhotoBlock } from './PhotoBlock';
import { postSummary } from './PostCard';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Props = {
  message: Message;
  quoted?: Post;
  status?: 'Leído' | 'Enviado';
  onLongPress: () => void;
};

/** Burbuja de chat: las mías en violeta a la derecha, las suyas en blanco a la izquierda. */
export function Bubble({ message, quoted, status, onLongPress }: Props) {
  const mine = message.from === 'me';
  const a = message.attachment;
  const fg = mine ? colors.white : colors.ink;
  const q = questionById(message.questionId);
  const topicLabel = q ? (q.topic === 'general' ? 'Primera cita' : categories[q.topic].label) : undefined;
  return (
    <View style={[styles.wrap, mine ? styles.right : styles.left]}>
      <PressableScale
        accessibilityRole="text"
        accessibilityLabel={`${mine ? 'Tú' : 'Mensaje'}, ${clock(message.createdAt)}: ${message.text ?? ''}`}
        accessibilityHint="Mantén pulsado para copiar o eliminar"
        accessibilityActions={[{ name: 'longpress', label: 'Opciones del mensaje' }]}
        onAccessibilityAction={onLongPress}
        onLongPress={onLongPress}
        delayLongPress={350}
        scaleTo={0.97}
        style={[styles.bubble, mine ? styles.mine : styles.theirs, a && styles.withMedia]}
      >
        {topicLabel ? (
          <View style={[styles.topic, { backgroundColor: q && q.topic !== 'general' ? categories[q.topic].solid : colors.primarySoft }]}>
            <Sparkles size={12} color={colors.ink} />
            <Txt variant="caption" color={colors.ink}>
              {topicLabel.toUpperCase()}
            </Txt>
          </View>
        ) : null}
        {quoted ? (
          <View style={[styles.quote, { backgroundColor: mine ? colors.primaryInk : colors.surface }]}>
            <CornerDownRight size={14} color={mine ? colors.onPrimaryMuted : colors.text2} />
            <Txt variant="footnote" color={mine ? colors.onPrimaryMuted : colors.text2} numberOfLines={2} style={styles.flex}>
              {quoted.authorId === 'me' ? 'Tu publicación' : 'Su publicación'}: {postSummary(quoted)}
            </Txt>
          </View>
        ) : null}
        {a ? (
          <View style={styles.media}>
            {a.type === 'song' ? <SongCard songId={a.refId} tone={mine ? 'onPrimary' : 'card'} /> : null}
            {a.type === 'activity' ? <ActivityCard activityId={a.refId} tone={mine ? 'onPrimary' : 'card'} /> : null}
            {a.type === 'place' ? <PlaceCard placeId={a.refId} tone={mine ? 'onPrimary' : 'card'} /> : null}
            {a.type === 'photo' ? <PhotoBlock category="culture" uri={a.uri} aspect={3 / 4} /> : null}
          </View>
        ) : null}
        {message.text ? (
          <Txt variant="body" color={fg} style={a ? styles.captionPad : undefined}>
            {message.text}
          </Txt>
        ) : null}
        <Txt variant="caption" color={mine ? colors.onPrimaryMuted : colors.text3} align="right" style={a ? styles.captionPad : undefined}>
          {clock(message.createdAt)}
        </Txt>
      </PressableScale>
      {status ? (
        <Txt variant="caption" color={status === 'Leído' ? colors.primaryInk : colors.text3} style={styles.status}>
          {status}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { maxWidth: '82%', gap: 2 },
  left: { alignSelf: 'flex-start' },
  right: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.card - 4, gap: 4 },
  withMedia: { padding: 4, width: 264 },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 6 },
  theirs: { backgroundColor: colors.bg, borderBottomLeftRadius: 6, borderWidth: 1, borderColor: colors.line },
  quote: { flexDirection: 'row', gap: 6, padding: space.sm, borderRadius: 12, alignItems: 'flex-start' },
  flex: { flex: 1 },
  topic: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  media: { borderRadius: radius.tile, overflow: 'hidden' },
  captionPad: { paddingHorizontal: space.sm, paddingBottom: 2 },
  status: { paddingHorizontal: 4 },
});
