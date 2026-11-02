import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Txt } from '@/components/Txt';
import { defaultFilters, useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { colors, gutter, radius, space } from '@/theme';
import type { DiscoverFilters } from '@/types';
import { tapLight, tapMedium } from '@/utils/haptics';

export default function Filters() {
  const current = useApp((s) => s.filters);
  const setFilters = useApp((s) => s.setFilters);
  const [draft, setDraft] = useState<DiscoverFilters>(current);
  const insets = useSafeAreaInsets();
  const patch = (p: Partial<DiscoverFilters>) => setDraft((d) => ({ ...d, ...p }));

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
      <ScrollView contentContainerStyle={styles.body}>
        <Txt variant="title1" accessibilityRole="header">
          Filtros
        </Txt>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Txt variant="headline">Distancia máxima</Txt>
            <Txt variant="headline" color={colors.primaryInk}>
              {draft.maxKm} km
            </Txt>
          </View>
          <Slider
            accessibilityLabel="Distancia máxima"
            minimumValue={1}
            maximumValue={25}
            step={1}
            value={draft.maxKm}
            onValueChange={(v: number) => {
              if (v !== draft.maxKm) tapLight();
              patch({ maxKm: v });
            }}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.line}
            thumbTintColor={colors.primary}
            style={styles.slider}
          />
          <View style={styles.rowBetween}>
            <Txt variant="footnote" color={colors.text3}>1 km</Txt>
            <Txt variant="footnote" color={colors.text3}>25 km</Txt>
          </View>
        </View>

        <View style={styles.section}>
          <Txt variant="headline">Rango de edad</Txt>
          <Stepper
            label="Desde"
            value={draft.minAge}
            onChange={(v) => patch({ minAge: v })}
            min={18}
            max={draft.maxAge}
          />
          <Stepper
            label="Hasta"
            value={draft.maxAge}
            onChange={(v) => patch({ maxAge: v })}
            min={draft.minAge}
            max={60}
          />
        </View>

        <View style={[styles.section, styles.rowBetween]}>
          <View style={styles.flex}>
            <Txt variant="headline">Solo perfiles verificados</Txt>
            <Txt variant="footnote" color={colors.text2}>
              Personas que han verificado su identidad con un selfie.
            </Txt>
          </View>
          <Switch
            accessibilityLabel="Solo perfiles verificados"
            value={draft.verifiedOnly}
            onValueChange={(v) => {
              tapLight();
              patch({ verifiedOnly: v });
            }}
            trackColor={{ true: colors.primary, false: colors.line }}
            ios_backgroundColor={colors.line}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label="Restablecer"
          variant="secondary"
          flex
          onPress={() => setDraft({ ...defaultFilters })}
        />
        <Button
          label="Aplicar"
          flex
          onPress={() => {
            tapMedium();
            setFilters(draft);
            router.back();
            toast('Filtros aplicados');
          }}
        />
      </View>
    </View>
  );
}

function Stepper({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <View style={styles.stepper}>
      <Txt variant="body" style={styles.flex}>
        {label}
      </Txt>
      <IconButton icon={Minus} label={`${label}: restar un año`} onPress={() => onChange(Math.max(min, value - 1))} disabled={value <= min} />
      <Txt variant="title2" style={styles.value} align="center" accessibilityLabel={`${label} ${value} años`}>
        {value}
      </Txt>
      <IconButton icon={Plus} label={`${label}: sumar un año`} onPress={() => onChange(Math.min(max, value + 1))} disabled={value >= max} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: gutter, paddingTop: space.xl, gap: space.xl },
  section: { gap: space.md, backgroundColor: colors.surface, borderRadius: radius.card, padding: space.lg },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  slider: { height: 44 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  value: { minWidth: 44 },
  flex: { flex: 1 },
  footer: { flexDirection: 'row', gap: space.sm, paddingHorizontal: gutter, paddingTop: space.md },
});
