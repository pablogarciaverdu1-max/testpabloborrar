import { router, useLocalSearchParams } from 'expo-router';
import { Pencil, Trash, X } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Input } from '@/components/Input';
import { PostCard } from '@/components/PostCard';
import { Txt } from '@/components/Txt';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { colors, gutter, space } from '@/theme';
import { confirm } from '@/utils/confirm';
import { notifySuccess, tapMedium } from '@/utils/haptics';

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = useApp((s) => s.posts.find((p) => p.id === id));
  const updatePost = useApp((s) => s.updatePost);
  const deletePost = useApp((s) => s.deletePost);
  const restorePost = useApp((s) => s.restorePost);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(post?.text ?? '');
  const insets = useSafeAreaInsets();

  if (!post) {
    return (
      <View style={styles.root}>
        <Txt variant="body" color={colors.text2} align="center" style={{ padding: space.xxl }}>
          Esta publicación ya no existe.
        </Txt>
      </View>
    );
  }

  const max = post.type === 'status' ? 280 : 200;
  const valid = post.type === 'status' ? text.trim().length > 0 : true;

  const onDelete = () =>
    confirm({
      title: '¿Eliminar publicación?',
      message: 'Desaparecerá de tu perfil para todo el mundo.',
      confirmText: 'Eliminar',
      destructive: true,
      onConfirm: () => {
        const removed = deletePost(post.id);
        router.back();
        toast('Publicación eliminada', { undo: removed ? () => restorePost(removed) : undefined });
      },
    });

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Txt variant="title2" accessibilityRole="header">
          {editing ? 'Editar texto' : 'Tu publicación'}
        </Txt>
        <IconButton icon={X} label="Cerrar" onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {editing ? (
          <Input
            label="Texto"
            value={text}
            onChangeText={(t) => setText(t.slice(0, max))}
            multiline
            autoFocus
            hint={`${text.length}/${max}`}
            placeholder="Escribe algo…"
          />
        ) : (
          <PostCard post={post} bare />
        )}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
        {editing ? (
          <>
            <Button label="Cancelar" variant="secondary" flex onPress={() => { setText(post.text ?? ''); setEditing(false); }} />
            <Button
              label="Guardar"
              flex
              disabled={!valid || text === (post.text ?? '')}
              onPress={() => {
                tapMedium();
                notifySuccess();
                updatePost(post.id, text.trim());
                setEditing(false);
                toast('Texto actualizado', { tone: 'success' });
              }}
            />
          </>
        ) : (
          <>
            <Button label="Editar texto" icon={Pencil} variant="secondary" flex onPress={() => setEditing(true)} />
            <Button label="Eliminar" icon={Trash} variant="danger" flex onPress={onDelete} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: gutter, paddingTop: space.xl, paddingBottom: space.sm },
  body: { paddingHorizontal: gutter, paddingBottom: space.xl, gap: space.md },
  footer: { flexDirection: 'row', gap: space.sm, paddingHorizontal: gutter, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
