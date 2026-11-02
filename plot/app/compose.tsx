import { router, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { Check, Disc3, Image as ImageIcon, MapPin, Route, Search, Type, type LucideIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Chip, ChipRow } from '@/components/Chip';
import { Input } from '@/components/Input';
import { PhotoBlock } from '@/components/PhotoBlock';
import { PressableScale } from '@/components/PressableScale';
import { Segmented } from '@/components/Segmented';
import { TextAction } from '@/components/TextAction';
import { Txt } from '@/components/Txt';
import { activities, categoryOf, places, songs } from '@/data/catalog';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { categories, colors, gutter, hit, radius, space, type CategoryId } from '@/theme';
import type { PostType, Visibility } from '@/types';
import { confirm } from '@/utils/confirm';
import { notifySuccess, tapLight, tapMedium } from '@/utils/haptics';
import { pickPhoto } from '@/utils/pickPhoto';

const types: { value: PostType; label: string; icon: LucideIcon; cat: CategoryId }[] = [
  { value: 'photo', label: 'Foto', icon: ImageIcon, cat: 'culture' },
  { value: 'status', label: 'Estado', icon: Type, cat: 'food' },
  { value: 'song', label: 'Canción', icon: Disc3, cat: 'music' },
  { value: 'activity', label: 'Actividad', icon: Route, cat: 'sport' },
  { value: 'place', label: 'Lugar', icon: MapPin, cat: 'places' },
];

const STATUS_MAX = 280;

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Compose() {
  const params = useLocalSearchParams<{ type?: PostType }>();
  const insets = useSafeAreaInsets();
  const myInterests = useApp((s) => s.me.interests);
  const addPost = useApp((s) => s.addPost);

  const [type, setType] = useState<PostType>(params.type ?? 'photo');
  const [text, setText] = useState('');
  const [photoUri, setPhotoUri] = useState<string>();
  const [songId, setSongId] = useState<string>();
  const [activityId, setActivityId] = useState<string>();
  const [placeId, setPlaceId] = useState<string>();
  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('everyone');
  const [tag, setTag] = useState<string>();
  const [done, setDone] = useState(false);

  const dirty = !!(text || photoUri || songId || activityId || placeId || query || tag || visibility !== 'everyone');

  const valid =
    (type === 'photo' && !!photoUri) ||
    (type === 'status' && text.trim().length > 0 && text.length <= STATUS_MAX) ||
    (type === 'song' && !!songId) ||
    (type === 'activity' && !!activityId) ||
    (type === 'place' && !!placeId);

  const disablePrevention = usePreventRemove(dirty && !done, ({ repeat }) => {
    confirm({
      title: '¿Descartar publicación?',
      message: 'Si sales ahora, perderás lo que has preparado.',
      confirmText: 'Descartar',
      cancelText: 'Seguir editando',
      destructive: true,
      onConfirm: () => {
        setDone(true);
        repeat();
      },
    });
  });

  const filteredSongs = useMemo(
    () => songs.filter((s) => norm(`${s.title} ${s.artist}`).includes(norm(query))),
    [query],
  );
  const filteredPlaces = useMemo(
    () => places.filter((p) => norm(`${p.name} ${p.area} ${p.kind}`).includes(norm(query))),
    [query],
  );

  const changeType = (t: PostType) => {
    tapLight();
    setType(t);
    setQuery('');
  };

  const publish = () => {
    if (!valid) return;
    const fallback = types.find((t) => t.value === type)?.cat ?? 'culture';
    addPost({
      type,
      text: text.trim() || undefined,
      photoUri: type === 'photo' ? photoUri : undefined,
      songId: type === 'song' ? songId : undefined,
      activityId: type === 'activity' ? activityId : undefined,
      placeId: type === 'place' ? placeId : undefined,
      tag,
      category: tag ? categoryOf(tag) : fallback,
      visibility,
    });
    tapMedium();
    notifySuccess();
    setDone(true);
    disablePrevention();
    router.back();
    setTimeout(() => router.navigate('/profile'), 50);
    toast('Publicado', { tone: 'success' });
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.bar}>
        <TextAction label="Cancelar" onPress={() => router.back()} />
        <Txt variant="headline">Nueva publicación</Txt>
        <View style={styles.publish}>
          <Button label="Publicar" size="sm" disabled={!valid} onPress={publish} haptic={false} />
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]} keyboardShouldPersistTaps="handled">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.types} accessibilityRole="tablist">
          {types.map((t) => {
            const on = t.value === type;
            const cat = categories[t.cat];
            const Icon = t.icon;
            return (
              <PressableScale
                key={t.value}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={t.label}
                onPress={() => changeType(t.value)}
                style={[styles.type, { backgroundColor: on ? cat.solid : cat.soft }]}
              >
                <Icon size={18} color={on ? colors.ink : cat.ink} />
                <Txt variant="subheadStrong" color={on ? colors.ink : cat.ink}>
                  {t.label}
                </Txt>
              </PressableScale>
            );
          })}
        </ScrollView>

        {type === 'photo' ? (
          <View style={styles.form}>
            {photoUri ? (
              <View style={styles.form}>
                <PhotoBlock category="culture" uri={photoUri} aspect={4 / 3} />
                <Button label="Cambiar foto" variant="secondary" size="md" onPress={async () => setPhotoUri((await pickPhoto()) ?? photoUri)} />
              </View>
            ) : (
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Elegir foto del carrete"
                onPress={async () => {
                  tapLight();
                  const uri = await pickPhoto();
                  if (uri) setPhotoUri(uri);
                }}
                style={styles.picker}
              >
                <ImageIcon size={32} color={colors.primary} />
                <Txt variant="headline" color={colors.primaryInk}>
                  Elegir del carrete
                </Txt>
                <Txt variant="footnote" color={colors.text2}>
                  Se abrirán tus fotos
                </Txt>
              </PressableScale>
            )}
            <Input label="Texto (opcional)" value={text} onChangeText={(t) => setText(t.slice(0, 200))} placeholder="Cuenta algo de esta foto" multiline hint={`${text.length}/200`} />
          </View>
        ) : null}

        {type === 'status' ? (
          <View style={styles.form}>
            <Input
              label="¿Qué te apetece contar?"
              value={text}
              onChangeText={(t) => setText(t.slice(0, STATUS_MAX))}
              placeholder="Plan para el finde, una recomendación, una pregunta…"
              multiline
              autoFocus
            />
            <Txt variant="footnoteStrong" color={STATUS_MAX - text.length < 20 ? colors.dangerInk : colors.text3} align="right" accessibilityLabel={`Quedan ${STATUS_MAX - text.length} caracteres`}>
              {text.length}/{STATUS_MAX}
            </Txt>
          </View>
        ) : null}

        {type === 'song' ? (
          <View style={styles.form}>
            <Input value={query} onChangeText={setQuery} placeholder="Buscar canción o artista" left={<Search size={18} color={colors.text3} />} returnKeyType="search" clearButtonMode="while-editing" accessibilityLabel="Buscar canción" />
            {filteredSongs.length ? (
              filteredSongs.map((s) => (
                <SelectRow
                  key={s.id}
                  title={s.title}
                  subtitle={`${s.artist} · ${s.duration}`}
                  icon={Disc3}
                  cat="music"
                  selected={songId === s.id}
                  onPress={() => setSongId(songId === s.id ? undefined : s.id)}
                />
              ))
            ) : (
              <Txt variant="subhead" color={colors.text2} align="center" style={styles.empty}>
                No encontramos «{query}» en tu Spotify.
              </Txt>
            )}
            <Input label="Texto (opcional)" value={text} onChangeText={(t) => setText(t.slice(0, 200))} placeholder="¿Por qué esta canción?" />
          </View>
        ) : null}

        {type === 'activity' ? (
          <View style={styles.form}>
            <Txt variant="footnoteStrong" color={colors.text2}>
              TUS ACTIVIDADES DE STRAVA
            </Txt>
            {activities.map((a) => (
              <SelectRow
                key={a.id}
                title={a.title}
                subtitle={`${a.kind} · ${a.km.toLocaleString('es-ES')} km · ${a.pace} · ${a.elevation} m+`}
                icon={Route}
                cat="sport"
                selected={activityId === a.id}
                onPress={() => setActivityId(activityId === a.id ? undefined : a.id)}
              />
            ))}
            <Input label="Texto (opcional)" value={text} onChangeText={(t) => setText(t.slice(0, 200))} placeholder="¿Qué tal fue?" />
          </View>
        ) : null}

        {type === 'place' ? (
          <View style={styles.form}>
            <Input value={query} onChangeText={setQuery} placeholder="Buscar un lugar" left={<Search size={18} color={colors.text3} />} returnKeyType="search" clearButtonMode="while-editing" accessibilityLabel="Buscar lugar" />
            {filteredPlaces.length ? (
              filteredPlaces.map((p) => (
                <SelectRow
                  key={p.id}
                  title={p.name}
                  subtitle={`${p.kind} · ${p.area}`}
                  icon={MapPin}
                  cat="places"
                  selected={placeId === p.id}
                  onPress={() => setPlaceId(placeId === p.id ? undefined : p.id)}
                />
              ))
            ) : (
              <Txt variant="subhead" color={colors.text2} align="center" style={styles.empty}>
                No encontramos «{query}».
              </Txt>
            )}
            <Input label="Texto (opcional)" value={text} onChangeText={(t) => setText(t.slice(0, 200))} placeholder="¿Por qué te gusta este sitio?" />
          </View>
        ) : null}

        <View style={styles.section}>
          <Txt variant="headline">Visible para</Txt>
          <Segmented
            options={[
              { value: 'everyone', label: 'Todo el mundo' },
              { value: 'common', label: 'Intereses en común' },
            ]}
            value={visibility}
            onChange={setVisibility}
          />
          <Txt variant="footnote" color={colors.text3}>
            {visibility === 'everyone' ? 'Cualquier persona de PLOT podrá verla.' : 'Solo la verá gente con la que compartes algún interés.'}
          </Txt>
        </View>

        <View style={styles.section}>
          <Txt variant="headline">Etiquetar interés</Txt>
          <ChipRow>
            {myInterests.map((i) => (
              <Chip key={i} label={i} solid={tag === i} showCheck onPress={() => setTag(tag === i ? undefined : i)} />
            ))}
          </ChipRow>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SelectRow({ title, subtitle, icon: Icon, cat, selected, onPress }: { title: string; subtitle: string; icon: LucideIcon; cat: CategoryId; selected: boolean; onPress: () => void }) {
  const c = categories[cat];
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}, ${subtitle}`}
      onPress={() => {
        tapLight();
        onPress();
      }}
      scaleTo={0.99}
      style={[styles.row, { borderColor: selected ? colors.primary : colors.line, backgroundColor: selected ? colors.primarySoft : colors.bg }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: c.solid }]}>
        <Icon size={20} color={colors.ink} />
      </View>
      <View style={styles.flex}>
        <Txt variant="headline">{title}</Txt>
        <Txt variant="footnote" color={colors.text2}>
          {subtitle}
        </Txt>
      </View>
      {selected ? <Check size={22} color={colors.primary} strokeWidth={2.6} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.sm, paddingTop: space.sm, paddingBottom: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  publish: { paddingRight: space.sm },
  body: { paddingTop: space.lg, gap: space.xl },
  types: { paddingHorizontal: gutter, gap: space.sm },
  type: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: hit, paddingHorizontal: space.lg, borderRadius: radius.chip },
  form: { paddingHorizontal: gutter, gap: space.md },
  picker: { alignItems: 'center', justifyContent: 'center', gap: space.sm, aspectRatio: 4 / 3, borderRadius: radius.card, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary, backgroundColor: colors.primarySoft },
  section: { paddingHorizontal: gutter, gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.tile, borderWidth: 1.5 },
  rowIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2 },
  empty: { paddingVertical: space.lg },
});
