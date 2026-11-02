import { Disc3, MapPin, Route } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { activityById, placeById, songById } from '@/data/catalog';
import { postPhotos } from '@/data/photos';
import { categories, colors, radius } from '@/theme';
import type { Post } from '@/types';

import { PhotoBlock } from './PhotoBlock';
import { postTypeLabel } from './PostCard';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

/** Miniatura cuadrada para la cuadrícula de Mi perfil. */
export function PostTile({ post, onPress }: { post: Post; onPress: () => void }) {
  const cat = categories[post.category];
  let inner: React.ReactNode;
  const img = postPhotos[post.id];
  if (post.type === 'photo' || (img && post.type !== 'status')) {
    inner = <PhotoBlock category={post.category} label={post.photoLabel?.replace('Foto · ', '')} uri={post.photoUri} source={img} aspect={1} rounded={0} compact />;
  } else {
    const Icon = post.type === 'song' ? Disc3 : post.type === 'activity' ? Route : post.type === 'place' ? MapPin : null;
    const title =
      post.type === 'song'
        ? songById(post.songId)?.title
        : post.type === 'activity'
          ? activityById(post.activityId)?.title
          : post.type === 'place'
            ? placeById(post.placeId)?.name
            : post.text;
    inner = (
      <View style={[styles.tile, { backgroundColor: post.type === 'status' ? cat.soft : cat.solid }]}>
        {Icon ? <Icon size={20} color={colors.ink} /> : null}
        <Txt variant="footnoteStrong" color={colors.ink} numberOfLines={post.type === 'status' ? 5 : 3} maxFontSizeMultiplier={1.3}>
          {title}
        </Txt>
      </View>
    );
  }
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${postTypeLabel[post.type]}: ${post.text ?? ''}. Abrir detalle`}
      onPress={onPress}
      scaleTo={0.95}
      style={styles.wrap}
    >
      {inner}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, aspectRatio: 1, borderRadius: radius.tile - 4, overflow: 'hidden' },
  tile: { flex: 1, padding: 10, gap: 6, justifyContent: 'flex-end' },
});
