import { Disc3, MapPin, Mountain, Route, TrendingUp } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { activityById, placeById, songById } from '@/data/catalog';
import { categories, colors, radius, space } from '@/theme';

import { Txt } from './Txt';

type Tone = 'card' | 'onPrimary';

/** Tarjeta de canción (Spotify simulado). */
export function SongCard({ songId, tone = 'card', cover }: { songId?: string; tone?: Tone; cover?: ImageSourcePropType }) {
  const song = songById(songId);
  const [failed, setFailed] = useState(false);
  if (!song) return null;
  const cat = categories.music;
  return (
    <View style={[styles.row, { backgroundColor: tone === 'card' ? cat.soft : colors.white }]}>
      {cover && !failed ? (
        <Image source={cover as never} style={styles.cover} contentFit="cover" accessibilityLabel="Portada" onError={() => setFailed(true)} />
      ) : (
        <View style={[styles.cover, { backgroundColor: cat.solid }]}>
          <Disc3 size={26} color={colors.ink} />
        </View>
      )}
      <View style={styles.flex}>
        <Txt variant="headline" numberOfLines={2}>{song.title}</Txt>
        <Txt variant="footnote" color={colors.text2} numberOfLines={1}>
          {song.artist} · {song.duration}
        </Txt>
        <Txt variant="caption" color={cat.ink}>SPOTIFY</Txt>
      </View>
    </View>
  );
}

/** Tarjeta de actividad (Strava simulado). */
export function ActivityCard({ activityId, tone = 'card' }: { activityId?: string; tone?: Tone }) {
  const a = activityById(activityId);
  if (!a) return null;
  const cat = categories.sport;
  return (
    <View style={[styles.box, { backgroundColor: tone === 'card' ? cat.soft : colors.white }]}>
      <View style={styles.rowPlain}>
        <View style={[styles.iconDot, { backgroundColor: cat.solid }]}>
          <Route size={18} color={colors.ink} />
        </View>
        <View style={styles.flex}>
          <Txt variant="headline" numberOfLines={2}>{a.title}</Txt>
          <Txt variant="caption" color={cat.ink}>STRAVA · {a.kind.toUpperCase()}</Txt>
        </View>
      </View>
      <View style={styles.stats}>
        <Stat label="Distancia" value={`${a.km.toLocaleString('es-ES')} km`} />
        <Stat label={a.kind === 'Bici' ? 'Velocidad' : a.kind === 'Senderismo' ? 'Tiempo' : 'Ritmo'} value={a.pace} />
        <Stat label="Desnivel" value={`${a.elevation} m`} icon />
      </View>
    </View>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <View style={styles.stat}>
      <Txt variant="caption" color={colors.text2}>{label.toUpperCase()}</Txt>
      <View style={styles.rowPlain}>
        {icon ? <TrendingUp size={14} color={colors.ink} /> : null}
        <Txt variant="subheadStrong">{value}</Txt>
      </View>
    </View>
  );
}

/** Tarjeta de lugar (Google Maps simulado). */
export function PlaceCard({ placeId, tone = 'card' }: { placeId?: string; tone?: Tone }) {
  const p = placeById(placeId);
  if (!p) return null;
  const cat = categories.places;
  return (
    <View style={[styles.box, { backgroundColor: tone === 'card' ? cat.soft : colors.white, padding: 0, overflow: 'hidden' }]}>
      <View style={[styles.map, { backgroundColor: cat.solid }]}>
        <View style={[styles.road, { backgroundColor: cat.soft }]} />
        <View style={[styles.road2, { backgroundColor: cat.soft }]} />
        <View style={styles.pin}>
          {p.kind === 'Montaña' ? <Mountain size={18} color={colors.white} /> : <MapPin size={18} color={colors.white} />}
        </View>
      </View>
      <View style={{ padding: space.md }}>
        <Txt variant="headline" numberOfLines={2}>{p.name}</Txt>
        <Txt variant="footnote" color={colors.text2}>
          {p.kind} · {p.area}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.tile },
  rowPlain: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  cover: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
  box: { padding: space.md, borderRadius: radius.tile, gap: space.md },
  iconDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: space.md, flexWrap: 'wrap' },
  stat: { gap: 2, minWidth: 80 },
  map: { height: 96, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  road: { position: 'absolute', height: 10, width: '140%', opacity: 0.6, transform: [{ rotate: '-12deg' }], top: 30 },
  road2: { position: 'absolute', width: 10, height: '160%', opacity: 0.6, left: '62%', transform: [{ rotate: '20deg' }] },
  pin: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});
