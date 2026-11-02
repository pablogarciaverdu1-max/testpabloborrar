import { ChevronLeft, Disc3, Image as ImageIcon, MapPin, Route, Search, type LucideIcon } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { activities, places, songs } from '@/data/catalog';
import { categories, colors, hit, radius, space, type CategoryId } from '@/theme';
import type { Attachment } from '@/types';
import { tapLight } from '@/utils/haptics';
import { pickPhoto } from '@/utils/pickPhoto';

import { BottomSheet } from './BottomSheet';
import { IconButton } from './IconButton';
import { Input } from './Input';
import { PressableScale } from './PressableScale';
import { Txt } from './Txt';

type Step = 'menu' | 'song' | 'activity' | 'place';

type Item = { id: string; title: string; subtitle: string };

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Hoja para adjuntar canción, actividad, lugar o foto real en un chat. */
export function AttachSheet({ visible, onClose, onSend }: { visible: boolean; onClose: () => void; onSend: (a: Attachment) => void }) {
  const [step, setStep] = useState<Step>('menu');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => {
        setStep('menu');
        setQuery('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const items: Item[] = useMemo(() => {
    const q = norm(query);
    if (step === 'song') return songs.filter((s) => norm(`${s.title} ${s.artist}`).includes(q)).map((s) => ({ id: s.id, title: s.title, subtitle: `${s.artist} · ${s.duration}` }));
    if (step === 'activity') return activities.filter((a) => norm(a.title).includes(q)).map((a) => ({ id: a.id, title: a.title, subtitle: `${a.kind} · ${a.km.toLocaleString('es-ES')} km · ${a.elevation} m+` }));
    if (step === 'place') return places.filter((p) => norm(`${p.name} ${p.area}`).includes(q)).map((p) => ({ id: p.id, title: p.name, subtitle: `${p.kind} · ${p.area}` }));
    return [];
  }, [step, query]);

  const meta: Record<Exclude<Step, 'menu'>, { title: string; icon: LucideIcon; cat: CategoryId }> = {
    song: { title: 'Canción', icon: Disc3, cat: 'music' },
    activity: { title: 'Actividad', icon: Route, cat: 'sport' },
    place: { title: 'Lugar', icon: MapPin, cat: 'places' },
  };

  const choosePhoto = async () => {
    onClose();
    const uri = await pickPhoto();
    if (uri) onSend({ type: 'photo', uri });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={step === 'menu' ? 'Adjuntar' : meta[step].title} maxHeight={0.8}>
      {step === 'menu' ? (
        <View style={styles.grid}>
          <Option label="Canción" detail="De tu Spotify" icon={Disc3} cat="music" onPress={() => setStep('song')} />
          <Option label="Actividad" detail="De tu Strava" icon={Route} cat="sport" onPress={() => setStep('activity')} />
          <Option label="Lugar" detail="De Google Maps" icon={MapPin} cat="places" onPress={() => setStep('place')} />
          <Option label="Foto" detail="De tu carrete" icon={ImageIcon} cat="culture" onPress={choosePhoto} />
        </View>
      ) : (
        <View style={styles.list}>
          <View style={styles.searchRow}>
            <IconButton icon={ChevronLeft} label="Volver a adjuntar" onPress={() => { setStep('menu'); setQuery(''); }} />
            <View style={styles.flex}>
              <Input value={query} onChangeText={setQuery} placeholder="Buscar" left={<Search size={18} color={colors.text3} />} accessibilityLabel={`Buscar ${meta[step].title.toLowerCase()}`} autoCorrect={false} />
            </View>
          </View>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            keyboardShouldPersistTaps="handled"
            style={styles.flatList}
            ListEmptyComponent={
              <Txt variant="subhead" color={colors.text2} align="center" style={{ padding: space.lg }}>
                Sin resultados
              </Txt>
            }
            renderItem={({ item }) => {
              const Icon = meta[step].icon;
              return (
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={`Enviar ${item.title}`}
                  onPress={() => {
                    tapLight();
                    onSend({ type: step, refId: item.id } as Attachment);
                    onClose();
                  }}
                  style={styles.row}
                  scaleTo={0.99}
                >
                  <View style={[styles.rowIcon, { backgroundColor: categories[meta[step].cat].solid }]}>
                    <Icon size={20} color={colors.ink} />
                  </View>
                  <View style={styles.flex}>
                    <Txt variant="headline">{item.title}</Txt>
                    <Txt variant="footnote" color={colors.text2}>
                      {item.subtitle}
                    </Txt>
                  </View>
                </PressableScale>
              );
            }}
          />
        </View>
      )}
    </BottomSheet>
  );
}

function Option({ label, detail, icon: Icon, cat, onPress }: { label: string; detail: string; icon: LucideIcon; cat: CategoryId; onPress: () => void }) {
  const c = categories[cat];
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${detail}`}
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={[styles.option, { backgroundColor: c.soft }]}
    >
      <View style={[styles.optionIcon, { backgroundColor: c.solid }]}>
        <Icon size={22} color={colors.ink} />
      </View>
      <Txt variant="headline">{label}</Txt>
      <Txt variant="footnote" color={c.ink}>
        {detail}
      </Txt>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, paddingBottom: space.sm },
  option: { width: '48.5%', borderRadius: radius.card, padding: space.lg, gap: 4, minHeight: 120 },
  optionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  list: { gap: space.sm, flexShrink: 1 },
  flatList: { flexGrow: 0 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  flex: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm, minHeight: hit + 8 },
  rowIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
