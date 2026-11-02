import { Image } from 'expo-image';
import { BadgeCheck } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { avatarPhotos } from '@/data/photos';
import { categories, colors, type CategoryId } from '@/theme';

import { Txt } from './Txt';

type Props = {
  name: string;
  color: CategoryId;
  size?: 40 | 56 | 88;
  /** Id de la persona para buscar su foto real. */
  photoId?: string;
  verified?: boolean;
  /** Muestra el distintivo de verificación además del anillo. */
  badge?: boolean;
  bordered?: boolean;
};

/** Avatar con iniciales sobre color de categoría. Anillo violeta si está verificado. */
export function Avatar({ name, color, size = 56, verified, badge, bordered, photoId }: Props) {
  const [failed, setFailed] = useState(false);
  const photo = photoId && !failed ? avatarPhotos[photoId] : undefined;
  const ring = verified ? (size === 88 ? 3 : 2) : 0;
  const gap = verified ? 2 : 0;
  const outer = size;
  const inner = size - (ring + gap) * 2;
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View
      accessible
      accessibilityLabel={`${name}${verified ? ', perfil verificado' : ''}`}
      style={[
        styles.outer,
        {
          width: outer,
          height: outer,
          borderRadius: outer / 2,
          borderWidth: ring,
          borderColor: verified ? colors.primary : colors.transparent,
          backgroundColor: bordered ? colors.white : colors.transparent,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          { width: inner, height: inner, borderRadius: inner / 2, backgroundColor: categories[color].solid },
        ]}
      >
        {photo ? (
          <Image source={photo as never} style={{ width: inner, height: inner, borderRadius: inner / 2 }} contentFit="cover" onError={() => setFailed(true)} />
        ) : (
          <Txt variant={size === 88 ? 'title1' : size === 56 ? 'title2' : 'headline'} color={colors.ink} maxFontSizeMultiplier={1}>
            {initials}
          </Txt>
        )}
      </View>
      {verified && badge ? (
        <View style={[styles.badge, size === 88 ? styles.badgeLg : styles.badgeSm]}>
          <BadgeCheck size={size === 88 ? 22 : 16} color={colors.white} fill={colors.primary} strokeWidth={2} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { alignItems: 'center', justifyContent: 'center' },
  inner: { alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', backgroundColor: colors.white, borderRadius: 999, padding: 1 },
  badgeLg: { right: -2, bottom: 0 },
  badgeSm: { right: -4, bottom: -2 },
});
