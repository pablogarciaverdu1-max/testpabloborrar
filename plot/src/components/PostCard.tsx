import { CornerDownRight, Lock } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { activityById, placeById, songById } from '@/data/catalog';
import { postPhotos } from '@/data/photos';
import { categories, colors, radius, space } from '@/theme';
import type { Post } from '@/types';
import { relative } from '@/utils/time';

import { Chip } from './Chip';
import { ActivityCard, PlaceCard, SongCard } from './MediaCards';
import { PhotoBlock } from './PhotoBlock';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

export const postTypeLabel: Record<Post['type'], string> = {
  photo: 'Foto',
  status: 'Estado',
  song: 'Canción',
  activity: 'Actividad',
  place: 'Lugar',
};

type Props = {
  post: Post;
  onReply?: () => void;
  replyLabel?: string;
  /** Interés etiquetado resaltado como común. */
  sharedTag?: boolean;
  bare?: boolean;
};

/** Contenido de la publicación según su tipo. */
export function PostBody({ post }: { post: Post }) {
  const img = postPhotos[post.id];
  switch (post.type) {
    case 'photo':
      return <PhotoBlock category={post.category} label={post.photoLabel} uri={post.photoUri} source={img} />;
    case 'song':
      return <SongCard songId={post.songId} cover={img} />;
    case 'activity':
      return (
        <View style={styles.stack}>
          {img ? <PhotoBlock category={post.category} source={img} aspect={16 / 10} label={activityById(post.activityId)?.title} hideOnError /> : null}
          <ActivityCard activityId={post.activityId} />
        </View>
      );
    case 'place':
      return (
        <View style={styles.stack}>
          {img ? <PhotoBlock category={post.category} source={img} aspect={16 / 10} label={placeById(post.placeId)?.name} hideOnError /> : null}
          <PlaceCard placeId={post.placeId} />
        </View>
      );
    case 'status':
      return (
        <View style={[styles.status, { backgroundColor: categories[post.category].soft }]}>
          <Txt variant="title2" color={colors.ink}>{post.text}</Txt>
        </View>
      );
  }
}

/** Tarjeta de publicación: Foto, Estado, Spotify, Strava o Lugar. */
export function PostCard({ post, onReply, replyLabel = 'Responder a esto', sharedTag, bare }: Props) {
  return (
    <View style={[styles.card, bare && styles.bare]}>
      <View style={styles.meta}>
        <Txt variant="caption" color={categories[post.category].ink}>
          {postTypeLabel[post.type].toUpperCase()}
        </Txt>
        <Txt variant="footnote" color={colors.text3}>· {relative(post.createdAt)}</Txt>
        {post.visibility === 'common' ? (
          <View style={styles.lock} accessible accessibilityLabel="Visible solo para gente con intereses en común">
            <Lock size={12} color={colors.text3} />
          </View>
        ) : null}
      </View>
      <PostBody post={post} />
      {post.text && post.type !== 'status' ? <Txt variant="body">{post.text}</Txt> : null}
      {post.tag || onReply ? (
        <View style={styles.footer}>
          {post.tag ? <Chip label={post.tag} solid={sharedTag} size="sm" /> : <View />}
          {onReply ? (
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={replyLabel}
              onPress={onReply}
              style={styles.reply}
            >
              <CornerDownRight size={16} color={colors.primaryInk} />
              <Txt variant="subheadStrong" color={colors.primaryInk}>{replyLabel}</Txt>
            </PressableScale>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** Resumen de una línea para citas y listas. */
export function postSummary(post: Post): string {
  switch (post.type) {
    case 'photo':
      return post.text ?? post.photoLabel ?? 'Foto';
    case 'status':
      return post.text ?? 'Estado';
    case 'song': {
      const s = songById(post.songId);
      return s ? `«${s.title}», de ${s.artist}` : 'Canción';
    }
    case 'activity':
      return activityById(post.activityId)?.title ?? 'Actividad';
    case 'place':
      return placeById(post.placeId)?.name ?? 'Lugar';
  }
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.bg, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, padding: space.lg, gap: space.md },
  bare: { borderWidth: 0, padding: 0 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lock: { marginLeft: 2 },
  status: { padding: space.lg, borderRadius: radius.tile },
  stack: { gap: space.sm },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm, flexWrap: 'wrap' },
  reply: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: space.md, borderRadius: 999, backgroundColor: colors.primarySoft },
});
