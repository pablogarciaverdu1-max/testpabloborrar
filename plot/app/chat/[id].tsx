import * as Clipboard from 'expo-clipboard';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ArrowUp, ChevronLeft, CornerDownRight, Ellipsis, Plus, Sparkles, UserX, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AttachSheet } from '@/components/AttachSheet';
import { Avatar } from '@/components/Avatar';
import { Bubble } from '@/components/Bubble';
import { Chip, ChipRow } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { PostBody, postSummary, postTypeLabel } from '@/components/PostCard';
import { PressableScale } from '@/components/PressableScale';
import { SafetySheet } from '@/components/SafetySheet';
import { TypingBubble } from '@/components/TypingBubble';
import { Txt } from '@/components/Txt';
import { personById, postsOf, shared } from '@/store/selectors';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { categories, colors, fonts, gutter, hit, radius, space } from '@/theme';
import type { Attachment, Message } from '@/types';
import { showActions } from '@/utils/confirm';
import { tapLight, tapMedium } from '@/utils/haptics';
import { dayLabel, sameDay } from '@/utils/time';

type Row = { kind: 'day'; id: string; label: string } | { kind: 'msg'; id: string; message: Message };

export default function Conversation() {
  const { id, quote, draft } = useLocalSearchParams<{ id: string; quote?: string; draft?: string }>();
  const insets = useSafeAreaInsets();
  const person = personById(id);
  const me = useApp((s) => s.me);
  const posts = useApp((s) => s.posts);
  const conversation = useApp((s) => s.conversations[id]);
  const typing = useApp((s) => !!s.typing[id]);
  const isBlocked = useApp((s) => s.blocked.includes(id));
  const sendMessage = useApp((s) => s.sendMessage);
  const deleteMessage = useApp((s) => s.deleteMessage);
  const setActiveChat = useApp((s) => s.setActiveChat);
  const markRead = useApp((s) => s.markRead);

  const [text, setText] = useState(draft ?? '');
  const [quoted, setQuoted] = useState<string | undefined>(quote);
  const [attach, setAttach] = useState(false);
  const [safety, setSafety] = useState(false);
  const listRef = useRef<FlatList<Row>>(null);

  useFocusEffect(
    useCallback(() => {
      setActiveChat(id);
      markRead(id);
      return () => setActiveChat(null);
    }, [id, setActiveChat, markRead]),
  );

  useEffect(() => {
    if (conversation?.unread) markRead(id);
  }, [conversation?.unread, id, markRead]);

  const messages = useMemo(() => conversation?.messages ?? [], [conversation]);
  const isEmpty = messages.length === 0;
  const theirPosts = useMemo(() => postsOf(posts, id), [posts, id]);
  const common = person ? shared(me.interests, person.interests) : [];
  const quotedPost = posts.find((p) => p.id === quoted);
  const startedFrom = posts.find((p) => p.id === conversation?.startedFromPostId);

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    messages.forEach((m, i) => {
      if (i === 0 || !sameDay(messages[i - 1].createdAt, m.createdAt)) {
        out.push({ kind: 'day', id: `day-${m.id}`, label: dayLabel(m.createdAt) });
      }
      out.push({ kind: 'msg', id: m.id, message: m });
    });
    return out;
  }, [messages]);

  const lastMineId = [...messages].reverse().find((m) => m.from === 'me')?.id;

  const scrollToEnd = useCallback((animated = true) => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));
  }, []);

  useEffect(() => {
    const sub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => scrollToEnd());
    return () => sub.remove();
  }, [scrollToEnd]);

  useEffect(() => {
    if (typing) scrollToEnd();
  }, [typing, scrollToEnd]);

  if (!person || isBlocked) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + space.xl }]}>
        <EmptyState icon={UserX} title="Conversación no disponible" text="Has bloqueado a esta persona. Puedes desbloquearla en Ajustes." actionLabel="Volver" onAction={() => router.back()} />
      </View>
    );
  }

  const send = (attachment?: Attachment) => {
    const body = text.trim();
    if (!body && !attachment) return;
    tapMedium();
    sendMessage(id, attachment ? { attachment, quotedPostId: quoted } : { text: body, quotedPostId: quoted });
    if (!attachment) setText('');
    setQuoted(undefined);
    scrollToEnd();
  };

  const onLongPress = (m: Message) => {
    tapLight();
    showActions(undefined, [
      ...(m.text
        ? [
            {
              label: 'Copiar',
              onPress: () => {
                Clipboard.setStringAsync(m.text ?? '').catch(() => undefined);
                toast('Mensaje copiado');
              },
            },
          ]
        : []),
      {
        label: 'Eliminar',
        destructive: true,
        onPress: () => {
          deleteMessage(id, m.id);
          toast('Mensaje eliminado');
        },
      },
    ]);
  };

  const openProfile = () => router.push({ pathname: '/person/[id]', params: { id } });

  const intro = startedFrom ? (
    <View style={styles.startCard}>
      <CornerDownRight size={18} color={colors.primaryInk} />
      <Txt variant="subhead" color={colors.ink} style={styles.flex}>
        {person.name} empezó la conversación desde tu publicación <Txt variant="subheadStrong">{postSummary(startedFrom)}</Txt>
      </Txt>
    </View>
  ) : null;

  const firstMessage = (
    <View style={styles.first}>
      <View style={styles.firstCard}>
        <View style={styles.firstHead}>
          <Sparkles size={18} color={colors.white} />
          <Txt variant="title2" color={colors.white}>
            Sin match, sin swipe. Escríbele tú primero
          </Txt>
        </View>
        {common.length ? (
          <>
            <Txt variant="subhead" color={colors.white}>
              Tenéis en común:
            </Txt>
            <ChipRow>
              {common.map((i) => (
                <Chip key={i} label={i} solid size="sm" />
              ))}
            </ChipRow>
          </>
        ) : (
          <Txt variant="subhead" color={colors.white}>
            Aún no compartís intereses. Pregúntale por lo que publica.
          </Txt>
        )}
      </View>

      <Txt variant="footnoteStrong" color={colors.text2}>
        PARA ROMPER EL HIELO
      </Txt>
      <ChipRow>
        {person.icebreakers.map((q) => (
          <PressableScale
            key={q}
            accessibilityRole="button"
            accessibilityLabel={`Usar: ${q}`}
            onPress={() => {
              tapLight();
              setText(q);
            }}
            style={[styles.ice, text === q && styles.iceOn]}
          >
            <Txt variant="subheadStrong" color={text === q ? colors.white : colors.primaryInk}>
              {q}
            </Txt>
          </PressableScale>
        ))}
      </ChipRow>

      {theirPosts.length ? (
        <>
          <Txt variant="footnoteStrong" color={colors.text2}>
            RESPONDER A UNA DE SUS PUBLICACIONES
          </Txt>
          {theirPosts.slice(0, 2).map((p) => {
            const on = quoted === p.id;
            return (
              <PressableScale
                key={p.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`Responder a: ${postSummary(p)}`}
                onPress={() => {
                  tapLight();
                  setQuoted(on ? undefined : p.id);
                }}
                style={[styles.postPick, { borderColor: on ? colors.primary : colors.line }]}
                scaleTo={0.99}
              >
                <View style={styles.postPickHead}>
                  <Txt variant="caption" color={categories[p.category].ink}>
                    {postTypeLabel[p.type].toUpperCase()}
                  </Txt>
                  <Txt variant="footnoteStrong" color={on ? colors.primaryInk : colors.text3}>
                    {on ? 'Citada' : 'Citar'}
                  </Txt>
                </View>
                <PostBody post={p} />
                {p.text && p.type !== 'status' ? <Txt variant="subhead">{p.text}</Txt> : null}
              </PressableScale>
            );
          })}
        </>
      ) : null}
      <Txt variant="footnote" color={colors.text3} align="center">
        {person.name} verá tu mensaje en Solicitudes.
      </Txt>
    </View>
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + space.xs }]}>
        <IconButton icon={ChevronLeft} label="Volver" tone="plain" onPress={() => router.back()} />
        <PressableScale accessibilityRole="button" accessibilityLabel={`Ver perfil de ${person.name}`} onPress={openProfile} style={styles.who} scaleTo={0.98}>
          <Avatar photoId={person.id} name={person.name} color={person.color} size={40} verified={person.verified} />
          <View style={styles.flex}>
            <Txt variant="headline" numberOfLines={1}>
              {person.name}
            </Txt>
            <Txt variant="footnote" color={typing ? colors.primaryInk : colors.text2} numberOfLines={1}>
              {typing ? 'escribiendo…' : `${person.hood} · a ${person.km.toLocaleString('es-ES')} km`}
            </Txt>
          </View>
        </PressableScale>
        <IconButton icon={Ellipsis} label="Más opciones: silenciar, bloquear o reportar" tone="plain" onPress={() => setSafety(true)} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={rows}
          keyExtractor={(r) => r.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => scrollToEnd(false)}
          ListHeaderComponent={isEmpty ? firstMessage : (intro ?? undefined)}
          ListFooterComponent={typing ? <TypingBubble /> : undefined}
          renderItem={({ item }) => {
            if (item.kind === 'day') {
              return (
                <Txt variant="caption" color={colors.text3} align="center" style={styles.day}>
                  {item.label.toUpperCase()}
                </Txt>
              );
            }
            const m = item.message;
            const status = m.id === lastMineId ? (conversation?.seen ? 'Leído' : 'Enviado') : undefined;
            return <Bubble message={m} quoted={posts.find((p) => p.id === m.quotedPostId)} status={status} onLongPress={() => onLongPress(m)} />;
          }}
        />

        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
          {quotedPost ? (
            <View style={styles.quoteBar}>
              <CornerDownRight size={16} color={colors.primaryInk} />
              <Txt variant="footnote" color={colors.text2} numberOfLines={1} style={styles.flex}>
                Respondiendo a <Txt variant="footnoteStrong">{postSummary(quotedPost)}</Txt>
              </Txt>
              <IconButton icon={X} label="Quitar cita" tone="plain" size={18} onPress={() => setQuoted(undefined)} />
            </View>
          ) : null}
          <View style={styles.inputRow}>
            <IconButton icon={Plus} label="Adjuntar canción, actividad, lugar o foto" onPress={() => { Keyboard.dismiss(); setAttach(true); }} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={isEmpty ? `Escribe a ${person.name}…` : 'Mensaje'}
              placeholderTextColor={colors.text3}
              selectionColor={colors.primary}
              style={styles.input}
              multiline
              submitBehavior="submit"
              returnKeyType="send"
              enablesReturnKeyAutomatically
              onSubmitEditing={() => send()}
              maxFontSizeMultiplier={1.6}
              accessibilityLabel="Mensaje"
            />
            <IconButton icon={ArrowUp} label="Enviar" tone="primary" disabled={!text.trim()} onPress={() => send()} />
          </View>
        </View>
      </KeyboardAvoidingView>

      <AttachSheet visible={attach} onClose={() => setAttach(false)} onSend={(a) => send(a)} />
      <SafetySheet personId={id} visible={safety} onClose={() => setSafety(false)} onBlocked={() => {
        router.dismissAll();
        router.navigate('/chats');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingHorizontal: space.sm, paddingBottom: space.sm, backgroundColor: colors.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  who: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: hit },
  list: { flex: 1 },
  listContent: { padding: gutter, gap: space.sm, flexGrow: 1 },
  day: { paddingVertical: space.sm },
  startCard: { flexDirection: 'row', gap: space.sm, backgroundColor: colors.primarySoft, borderRadius: radius.tile, padding: space.md, marginBottom: space.sm },
  first: { gap: space.md, paddingBottom: space.lg },
  firstCard: { backgroundColor: colors.primary, borderRadius: radius.card, padding: space.lg, gap: space.md },
  firstHead: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  ice: { minHeight: 40, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.chip, backgroundColor: colors.primarySoft, justifyContent: 'center' },
  iceOn: { backgroundColor: colors.primary },
  postPick: { backgroundColor: colors.bg, borderRadius: radius.card, borderWidth: 2, padding: space.md, gap: space.sm },
  postPickHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  composer: { backgroundColor: colors.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingHorizontal: space.sm, paddingTop: space.sm, gap: space.xs },
  quoteBar: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingLeft: space.md, backgroundColor: colors.primarySoft, borderRadius: radius.button },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
  input: { flex: 1, minHeight: hit, maxHeight: 120, borderRadius: 22, backgroundColor: colors.surface, paddingHorizontal: space.lg, paddingTop: 11, paddingBottom: 11, fontFamily: fonts.regular, fontSize: 17, color: colors.ink },
});
