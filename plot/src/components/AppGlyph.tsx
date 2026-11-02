import { Disc3, Images, MapPin, Route, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { appInfo } from '@/data/catalog';
import { categories, colors } from '@/theme';
import type { AppId } from '@/types';

const icons: Record<AppId, LucideIcon> = { spotify: Disc3, strava: Route, maps: MapPin, photos: Images };

export function AppGlyph({ app, size = 40 }: { app: AppId; size?: number }) {
  const Icon = icons[app];
  return (
    <View
      style={[styles.glyph, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: categories[appInfo[app].category].solid }]}
    >
      <Icon size={size * 0.5} color={colors.ink} />
    </View>
  );
}

const styles = StyleSheet.create({ glyph: { alignItems: 'center', justifyContent: 'center' } });
