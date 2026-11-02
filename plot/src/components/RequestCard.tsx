import { CornerDownRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radius, space } from '@/theme';
import type { Conversation, Person, Post } from '@/types';
import { relative } from '@/utils/time';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { Chip, ChipRow } from './Chip';
import { postSummary } from './PostCard';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Props = {
  person: Person;
  conversation: Conversation;
  post?: Post;
  common: string[];
  onOpenProfile: () => void;
  onReply: () => void;
  onIgnore: () => void;
  onBlock: () => void;
};

/** Solicitud de mensaje: a qué publicación respondió, su mensaje y lo que tenéis en común. */
export function RequestCard({ person, conversation, post, common, onOpenProfile, onReply, onIgnore, onBlock }: Props) {
  const msg = conversation.messages[0];
  return (
    <View style={styles.card}>
      <PressableScale accessibilityRole="button" accessibilityLabel={`Ver perfil de ${person.name}`} onPress={onOpenProfile} style={styles.head} scaleTo={0.99}>
        <Avatar photoId={person.id} name={person.name} color={person.color} size={56} verified={person.verified} />
        <View style={styles.flex}>
          <Txt variant="headline">
            {person.name}, {person.age}
          </Txt>
          <Txt variant="footnote" color={colors.text2}>
            {person.hood} · {msg ? relative(msg.createdAt) : ''}
          </Txt>
        </View>
      </PressableScale>
      {post ? (
        <View style={styles.quote}>
          <CornerDownRight size={16} color={colors.text2} />
          <Txt variant="footnote" color={colors.text2} style={styles.flex} numberOfLines={2}>
            Respondió a tu publicación: <Txt variant="footnoteStrong">{postSummary(post)}</Txt>
          </Txt>
        </View>
      ) : null}
      <View style={styles.bubble}>
        <Txt variant="body">{msg?.text}</Txt>
      </View>
      {common.length ? (
        <ChipRow>
          {common.map((i) => (
            <Chip key={i} label={i} solid size="sm" />
          ))}
        </ChipRow>
      ) : null}
      <View style={styles.actions}>
        <Button label="Responder" size="md" flex onPress={onReply} />
        <Button label="Ignorar" variant="secondary" size="md" flex onPress={onIgnore} />
      </View>
      <Button label={`Bloquear a ${person.name}`} variant="text" size="sm" onPress={onBlock} style={styles.block} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, padding: space.lg, gap: space.md, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  flex: { flex: 1 },
  quote: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  bubble: { backgroundColor: colors.surface, borderRadius: radius.tile, borderTopLeftRadius: 6, padding: space.md },
  actions: { flexDirection: 'row', gap: space.sm },
  block: { alignSelf: 'center' },
});
