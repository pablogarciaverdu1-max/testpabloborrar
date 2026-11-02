import { router } from 'expo-router';
import { EyeOff, Inbox, MessageCircle, Search, ShieldAlert } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { ChatRow } from '@/components/ChatRow';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import { PressableScale } from '@/components/PressableScale';
import { RequestCard } from '@/components/RequestCard';
import { LargeHeader } from '@/components/ScreenHeader';
import { Segmented } from '@/components/Segmented';
import { Txt } from '@/components/Txt';
import { personById, shared, visibleChats, visibleRequests } from '@/store/selectors';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { colors, gutter, radius, space } from '@/theme';
import type { Conversation } from '@/types';
import { confirm } from '@/utils/confirm';
import { notifySuccess, tapLight } from '@/utils/haptics';
import { messagePreview } from '@/utils/messages';

type Tab = 'chats' | 'requests';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Chats() {
  const conversations = useApp((s) => s.conversations);
  const blocked = useApp((s) => s.blocked);
  const settings = useApp((s) => s.settings);
  const me = useApp((s) => s.me);
  const posts = useApp((s) => s.posts);
  const setMuted = useApp((s) => s.setMuted);
  const setDismissed = useApp((s) => s.setDismissed);
  const acceptRequest = useApp((s) => s.acceptRequest);
  const block = useApp((s) => s.block);
  const unblock = useApp((s) => s.unblock);
  const [tab, setTab] = useState<Tab>('chats');
  const [query, setQuery] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);

  const chats = useMemo(() => visibleChats({ conversations, blocked }), [conversations, blocked]);
  const requests = useMemo(() => visibleRequests({ conversations, blocked, settings, me }), [conversations, blocked, settings, me]);

  const matchesQuery = (c: Conversation) => {
    if (!query.trim()) return true;
    const p = personById(c.personId);
    const q = norm(query.trim());
    return norm(p?.name ?? '').includes(q) || c.messages.some((m) => norm(messagePreview(m)).includes(q));
  };
  const chatList = chats.filter(matchesQuery);
  const reqList = requests.normal.filter(matchesQuery);
  const unreadTotal = chats.reduce((n, c) => n + (c.muted ? 0 : c.unread), 0);

  const open = (id: string) => router.push({ pathname: '/chat/[id]', params: { id } });

  const onMute = (c: Conversation) => {
    const name = personById(c.personId)?.name ?? '';
    const next = !c.muted;
    setMuted(c.personId, next);
    toast(next ? `${name} silenciada` : `${name} con sonido`, { undo: () => setMuted(c.personId, !next) });
  };
  const onDelete = (c: Conversation) => {
    setDismissed(c.personId, true);
    toast(`Conversación con ${personById(c.personId)?.name ?? ''} eliminada`, { undo: () => setDismissed(c.personId, false) });
  };
  const onIgnore = (c: Conversation) => {
    setDismissed(c.personId, true);
    toast('Solicitud ignorada', { undo: () => setDismissed(c.personId, false) });
  };
  const onBlock = (c: Conversation) => {
    const name = personById(c.personId)?.name ?? '';
    confirm({
      title: `¿Bloquear a ${name}?`,
      message: `${name} no podrá volver a escribirte ni ver tu perfil. No le avisaremos.`,
      confirmText: 'Bloquear',
      destructive: true,
      onConfirm: () => {
        block(c.personId);
        notifySuccess();
        toast(`Has bloqueado a ${name}`, { undo: () => unblock(c.personId) });
      },
    });
  };
  const onReply = (c: Conversation) => {
    acceptRequest(c.personId);
    setTab('chats');
    open(c.personId);
  };

  const header = (
    <View style={styles.headerWrap}>
      <LargeHeader title="Chats" />
      <View style={styles.controls}>
        <Segmented
          options={[
            { value: 'chats', label: 'Conversaciones', badge: unreadTotal || undefined },
            { value: 'requests', label: 'Solicitudes', badge: requests.normal.length || undefined },
          ]}
          value={tab}
          onChange={setTab}
        />
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por nombre o mensaje"
          left={<Search size={18} color={colors.text3} />}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Buscar chats"
          autoCorrect={false}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {tab === 'chats' ? (
        <FlatList
          data={chatList}
          keyExtractor={(c) => c.personId}
          ListHeaderComponent={header}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => {
            const p = personById(item.personId);
            if (!p) return null;
            return (
              <ChatRow
                person={p}
                conversation={item}
                common={shared(me.interests, p.interests)}
                onPress={() => open(p.id)}
                onMute={() => onMute(item)}
                onDelete={() => onDelete(item)}
              />
            );
          }}
          ListEmptyComponent={
            query ? (
              <EmptyState icon={Search} title="Sin resultados" text={`No hay chats que coincidan con «${query}».`} />
            ) : (
              <EmptyState icon={MessageCircle} title="Aún no hablas con nadie" text="Sin match, sin swipe. Escribe a quien te guste lo que publica." actionLabel="Ir a Descubrir" onAction={() => router.navigate('/discover')} />
            )
          }
          contentContainerStyle={styles.listPad}
        />
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.listPad}>
          {header}
          <View style={styles.requests}>
            <Txt variant="subhead" color={colors.text2}>
              Personas que te escriben por primera vez. No sabrán que lo has leído hasta que respondas.
            </Txt>
            {reqList.map((c) => {
              const p = personById(c.personId);
              if (!p) return null;
              return (
                <RequestCard
                  key={c.personId}
                  person={p}
                  conversation={c}
                  post={posts.find((x) => x.id === c.startedFromPostId)}
                  common={shared(me.interests, p.interests)}
                  onOpenProfile={() => router.push({ pathname: '/person/[id]', params: { id: p.id } })}
                  onReply={() => onReply(c)}
                  onIgnore={() => onIgnore(c)}
                  onBlock={() => onBlock(c)}
                />
              );
            })}
            {reqList.length === 0 && requests.hidden.length === 0 ? (
              <EmptyState icon={Inbox} title="No tienes solicitudes" text="Cuando alguien te escriba por primera vez, aparecerá aquí." />
            ) : null}

            {requests.hidden.length ? (
              <View style={styles.hidden}>
                <View style={styles.hiddenRow}>
                  <View style={styles.hiddenIcon}>
                    <EyeOff size={18} color={colors.text2} />
                  </View>
                  <Txt variant="subheadStrong" style={styles.flex}>
                    {requests.hidden.length === 1 ? '1 mensaje oculto por el filtro' : `${requests.hidden.length} mensajes ocultos por el filtro`}
                  </Txt>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={showHidden ? 'Ocultar mensajes filtrados' : 'Ver mensajes filtrados'}
                    onPress={() => {
                      tapLight();
                      setShowHidden((v) => !v);
                    }}
                    style={styles.see}
                  >
                    <Txt variant="subheadStrong" color={colors.primaryInk}>
                      {showHidden ? 'Ocultar' : 'Ver'}
                    </Txt>
                  </PressableScale>
                </View>
                {showHidden
                  ? requests.hidden.map((c) => {
                      const p = personById(c.personId);
                      if (!p) return null;
                      const isRevealed = revealed.includes(c.personId);
                      return (
                        <View key={c.personId} style={styles.hiddenCard}>
                          <View style={styles.hiddenHead}>
                            <Avatar photoId={p.id} name={p.name} color={p.color} size={40} />
                            <View style={styles.flex}>
                              <Txt variant="headline">{p.name}</Txt>
                              <View style={styles.warn}>
                                <ShieldAlert size={14} color={colors.dangerInk} />
                                <Txt variant="footnoteStrong" color={colors.dangerInk}>
                                  Posible lenguaje ofensivo
                                </Txt>
                              </View>
                            </View>
                          </View>
                          <PressableScale
                            accessibilityRole="button"
                            accessibilityLabel={isRevealed ? c.messages[0]?.text : 'Mensaje oculto. Toca para mostrarlo'}
                            onPress={() => {
                              tapLight();
                              setRevealed((r) => (r.includes(c.personId) ? r : [...r, c.personId]));
                            }}
                            style={styles.blurBox}
                            scaleTo={0.99}
                          >
                            <Txt variant="body" style={isRevealed ? undefined : styles.blurred} selectable={isRevealed}>
                              {c.messages[0]?.text}
                            </Txt>
                            {!isRevealed ? (
                              <Txt variant="footnoteStrong" color={colors.text2} align="center" style={styles.tapHint}>
                                Toca para mostrar
                              </Txt>
                            ) : null}
                          </PressableScale>
                          <View style={styles.actions}>
                            <Button label="Bloquear" variant="danger" size="md" flex onPress={() => onBlock(c)} />
                            <Button label="Ignorar" variant="secondary" size="md" flex onPress={() => onIgnore(c)} />
                          </View>
                        </View>
                      );
                    })
                  : null}
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headerWrap: { paddingBottom: space.sm },
  controls: { paddingHorizontal: gutter, gap: space.md },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginLeft: gutter + 56 + space.md },
  listPad: { paddingBottom: space.xxl },
  requests: { paddingHorizontal: gutter, gap: space.md, paddingTop: space.sm },
  flex: { flex: 1 },
  hidden: { backgroundColor: colors.surface, borderRadius: radius.card, padding: space.md, gap: space.md },
  hiddenRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  hiddenIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  see: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.sm },
  hiddenCard: { backgroundColor: colors.bg, borderRadius: radius.tile + 4, padding: space.md, gap: space.md },
  hiddenHead: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  warn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  blurBox: { backgroundColor: colors.surface, borderRadius: radius.tile, padding: space.md, overflow: 'hidden', minHeight: 64, justifyContent: 'center' },
  blurred: { color: colors.transparent, textShadowColor: colors.text2, textShadowRadius: 14, textShadowOffset: { width: 0, height: 0 } },
  tapHint: { position: 'absolute', left: 0, right: 0 },
  actions: { flexDirection: 'row', gap: space.sm },
});
