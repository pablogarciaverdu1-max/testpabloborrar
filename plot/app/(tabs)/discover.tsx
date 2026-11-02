import { router } from 'expo-router';
import { SearchX, SlidersHorizontal } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { PersonCard } from '@/components/PersonCard';
import { PressableScale } from '@/components/PressableScale';
import { LargeHeader } from '@/components/ScreenHeader';
import { Txt } from '@/components/Txt';
import { people } from '@/data/seed';
import { defaultFilters, useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { categories, categoryOrder, cardGap, colors, gutter, radius, space } from '@/theme';
import { tapLight } from '@/utils/haptics';
import { filtersActive, rankPeople, type DiscoverTab } from '@/utils/rank';

const tabs: { value: DiscoverTab; label: string }[] = [
  { value: 'forYou', label: 'Para ti' },
  ...categoryOrder.map((c) => ({ value: c as DiscoverTab, label: categories[c].label })),
];

export default function Discover() {
  const me = useApp((s) => s.me);
  const posts = useApp((s) => s.posts);
  const blocked = useApp((s) => s.blocked);
  const filters = useApp((s) => s.filters);
  const setFilters = useApp((s) => s.setFilters);
  const seed = useApp((s) => s.discoverSeed);
  const shuffle = useApp((s) => s.shuffleDiscover);
  const [tab, setTab] = useState<DiscoverTab>('forYou');
  const [refreshing, setRefreshing] = useState(false);

  const list = useMemo(
    () =>
      rankPeople(
        people.filter((p) => !p.hiddenFromDiscover && !blocked.includes(p.id)),
        me.interests,
        tab,
        filters,
        seed,
      ),
    [blocked, me.interests, tab, filters, seed],
  );
  const active = filtersActive(filters, defaultFilters);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      shuffle();
      setRefreshing(false);
      toast('Recomendaciones actualizadas');
    }, 900);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={list}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: cardGap }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
        ListHeaderComponent={
          <View>
            <LargeHeader
              title="Descubrir"
              subtitle={`${list.length} ${list.length === 1 ? 'persona afín' : 'personas afines'} cerca de ${me.hood}`}
              right={
                <View>
                  <IconButton icon={SlidersHorizontal} label="Filtros" onPress={() => router.push('/filters')} tone={active ? 'primary' : 'surface'} />
                </View>
              }
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} accessibilityRole="tablist">
              {tabs.map((t) => {
                const on = t.value === tab;
                const cat = t.value === 'forYou' ? null : categories[t.value];
                return (
                  <PressableScale
                    key={t.value}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={t.label}
                    onPress={() => {
                      tapLight();
                      setTab(t.value);
                    }}
                    style={[
                      styles.tab,
                      { backgroundColor: on ? (cat ? cat.solid : colors.ink) : cat ? cat.soft : colors.surface },
                    ]}
                  >
                    <Txt variant="subheadStrong" color={on ? (cat ? colors.ink : colors.white) : cat ? cat.ink : colors.ink}>
                      {t.label}
                    </Txt>
                  </PressableScale>
                );
              })}
            </ScrollView>
            {active ? (
              <View style={styles.activeRow}>
                <Txt variant="footnote" color={colors.text2} style={styles.flex}>
                  Hasta {filters.maxKm} km · {filters.minAge}–{filters.maxAge} años{filters.verifiedOnly ? ' · solo verificados' : ''}
                </Txt>
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel="Quitar filtros"
                  onPress={() => {
                    tapLight();
                    setFilters({ ...defaultFilters });
                    toast('Filtros restablecidos');
                  }}
                  style={styles.clear}
                >
                  <Txt variant="footnoteStrong" color={colors.primaryInk}>
                    Quitar filtros
                  </Txt>
                </PressableScale>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <PersonCard person={item} myInterests={me.interests} posts={posts} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={SearchX}
            title="Nadie cumple estos filtros"
            text="Prueba a ampliar la distancia o el rango de edad, o mira otra categoría."
            actionLabel="Restablecer filtros"
            onAction={() => {
              setFilters({ ...defaultFilters });
              setTab('forYou');
            }}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  list: { paddingBottom: space.xxl },
  tabs: { paddingHorizontal: gutter, gap: space.sm, paddingBottom: space.md },
  tab: { minHeight: 40, paddingHorizontal: 16, borderRadius: radius.chip, justifyContent: 'center' },
  activeRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: gutter, paddingBottom: space.md, gap: space.sm },
  flex: { flex: 1 },
  clear: { minHeight: 44, justifyContent: 'center', paddingHorizontal: space.sm },
  cardWrap: { paddingHorizontal: gutter },
});
