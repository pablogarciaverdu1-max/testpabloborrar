import { router } from 'expo-router';
import { Eye, ImagePlus, MapPin, Pencil, Settings } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Chip, ChipRow } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { PostTile } from '@/components/PostTile';
import { LargeHeader } from '@/components/ScreenHeader';
import { Txt } from '@/components/Txt';
import { postsOf } from '@/store/selectors';
import { useApp } from '@/store/useApp';
import { colors, gutter, radius, space } from '@/theme';
import type { Post } from '@/types';

export default function MyProfile() {
  const me = useApp((s) => s.me);
  const posts = useApp((s) => s.posts);
  const mine = postsOf(posts, 'me');
  const rows: Post[][] = [];
  for (let i = 0; i < mine.length; i += 3) rows.push(mine.slice(i, i + 3));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LargeHeader title="Perfil" right={<IconButton icon={Settings} label="Ajustes" onPress={() => router.push('/settings')} />} />
        <View style={styles.head}>
          <Avatar photoId="me" name={me.name} color={me.color} size={88} verified badge />
          <View style={styles.flex}>
            <Txt variant="title1">
              {me.name}, {me.age}
            </Txt>
            <View style={styles.meta}>
              <MapPin size={15} color={colors.text2} />
              <Txt variant="subhead" color={colors.text2}>
                {me.hood}, Barcelona
              </Txt>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Txt variant="body">{me.bio}</Txt>
          <ChipRow>
            {me.interests.map((i) => (
              <Chip key={i} label={i} solid size="sm" />
            ))}
          </ChipRow>
          <View style={styles.note}>
            <Txt variant="footnoteStrong" color={colors.primaryInk} align="center">
              Sin likes ni seguidores. Solo lo que te gusta.
            </Txt>
          </View>
          <View style={styles.actions}>
            <Button label="Editar perfil" icon={Pencil} variant="secondary" size="md" flex onPress={() => router.push('/edit-profile')} />
            <Button label="Ver como otros" icon={Eye} variant="dark" size="md" flex onPress={() => router.push({ pathname: '/person/[id]', params: { id: 'me' } })} />
          </View>
        </View>

        <View style={styles.gridHead}>
          <Txt variant="title2">Mis publicaciones</Txt>
          <Txt variant="footnote" color={colors.text3}>
            {mine.length}
          </Txt>
        </View>
        {mine.length ? (
          <View style={styles.grid}>
            {rows.map((row, r) => (
              <View key={r} style={styles.gridRow}>
                {row.map((p) => (
                  <PostTile key={p.id} post={p} onPress={() => router.push({ pathname: '/post/[id]', params: { id: p.id } })} />
                ))}
                {row.length < 3 ? Array.from({ length: 3 - row.length }).map((_, i) => <View key={`f${i}`} style={styles.filler} />) : null}
              </View>
            ))}
          </View>
        ) : (
          <EmptyState icon={ImagePlus} title="Aún no has publicado nada" text="Comparte una canción, una ruta o un sitio que te guste." actionLabel="Crear publicación" onAction={() => router.push('/compose')} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: space.xxl },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.lg, paddingHorizontal: gutter },
  flex: { flex: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  section: { paddingHorizontal: gutter, paddingTop: space.lg, gap: space.md },
  note: { backgroundColor: colors.primarySoft, borderRadius: radius.button, paddingVertical: space.md, paddingHorizontal: space.lg },
  actions: { flexDirection: 'row', gap: space.sm },
  gridHead: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm, paddingHorizontal: gutter, paddingTop: space.xl, paddingBottom: space.md },
  grid: { paddingHorizontal: gutter, gap: 4 },
  gridRow: { flexDirection: 'row', gap: 4 },
  filler: { flex: 1 },
});
