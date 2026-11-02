import { router, usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, ChipRow } from '@/components/Chip';
import { Input } from '@/components/Input';
import { TextAction } from '@/components/TextAction';
import { Txt } from '@/components/Txt';
import { interestCatalog } from '@/data/catalog';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { categories, categoryOrder, colors, gutter, space } from '@/theme';
import { confirm } from '@/utils/confirm';
import { notifySuccess } from '@/utils/haptics';

const MIN_INTERESTS = 3;
const BIO_MAX = 160;

export default function EditProfile() {
  const me = useApp((s) => s.me);
  const updateMe = useApp((s) => s.updateMe);
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(me.name);
  const [bio, setBio] = useState(me.bio);
  const [interests, setInterests] = useState<string[]>(me.interests);
  const [saved, setSaved] = useState(false);

  const dirty = name !== me.name || bio !== me.bio || interests.join('|') !== me.interests.join('|');
  const nameError = name.trim().length === 0 ? 'Escribe tu nombre' : undefined;
  const interestsError = interests.length < MIN_INTERESTS ? `Elige al menos ${MIN_INTERESTS} intereses` : undefined;
  const valid = !nameError && !interestsError;

  const disablePrevention = usePreventRemove(dirty && !saved, ({ repeat }) => {
    confirm({
      title: '¿Descartar cambios?',
      message: 'Perderás lo que has cambiado en tu perfil.',
      confirmText: 'Descartar',
      cancelText: 'Seguir editando',
      destructive: true,
      onConfirm: () => {
        setSaved(true);
        repeat();
      },
    });
  });

  const save = () => {
    if (!valid) return;
    notifySuccess();
    updateMe({ name: name.trim(), bio: bio.trim(), interests });
    setSaved(true);
    disablePrevention();
    router.back();
    toast('Perfil actualizado', { tone: 'success' });
  };

  const toggle = (label: string) =>
    setInterests((list) => (list.includes(label) ? list.filter((i) => i !== label) : [...list, label]));

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.bar}>
        <TextAction label="Cancelar" onPress={() => router.back()} />
        <Txt variant="headline">Editar perfil</Txt>
        <TextAction label="Guardar" strong disabled={!valid || !dirty} onPress={save} />
      </View>
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]} keyboardShouldPersistTaps="handled">
        <Input label="Nombre" value={name} onChangeText={setName} error={nameError} maxLength={30} autoCapitalize="words" returnKeyType="next" />
        <Input label="Bio" value={bio} onChangeText={(t) => setBio(t.slice(0, BIO_MAX))} multiline hint={`${bio.length}/${BIO_MAX}`} placeholder="Cuéntale a la gente qué te gusta" />
        <View style={styles.section}>
          <Txt variant="headline">Intereses</Txt>
          <Txt variant="footnote" color={interestsError ? colors.dangerInk : colors.text2}>
            {interestsError ?? `${interests.length} elegidos`}
          </Txt>
        </View>
        {categoryOrder.map((cat) => (
          <View key={cat} style={styles.group}>
            <Txt variant="footnoteStrong" color={categories[cat].ink}>
              {categories[cat].label.toUpperCase()}
            </Txt>
            <ChipRow>
              {interestCatalog[cat].map((label) => (
                <Chip key={label} label={label} category={cat} solid={interests.includes(label)} showCheck onPress={() => toggle(label)} />
              ))}
            </ChipRow>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.sm, paddingTop: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  body: { paddingHorizontal: gutter, paddingTop: space.lg, gap: space.lg },
  section: { gap: 2, marginTop: space.sm },
  group: { gap: space.sm },
});
