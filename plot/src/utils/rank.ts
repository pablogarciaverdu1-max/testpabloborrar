import { categoryOf } from '@/data/catalog';
import type { CategoryId } from '@/theme';
import type { DiscoverFilters, Person } from '@/types';

/** Pseudoaleatorio estable a partir de una semilla y un id. */
function noise(seed: number, id: string) {
  let h = seed * 2654435761;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 2246822519);
  return ((h >>> 0) % 1000) / 1000;
}

export type DiscoverTab = 'forYou' | CategoryId;

export function rankPeople(
  list: Person[],
  mine: string[],
  tab: DiscoverTab,
  filters: DiscoverFilters,
  seed: number,
): Person[] {
  return list
    .filter((p) => p.km <= filters.maxKm && p.age >= filters.minAge && p.age <= filters.maxAge)
    .filter((p) => !filters.verifiedOnly || p.verified)
    .filter((p) => tab === 'forYou' || p.interests.some((i) => categoryOf(i) === tab))
    .map((p) => {
      const common = p.interests.filter((i) => mine.includes(i));
      const relevant = tab === 'forYou' ? common : common.filter((i) => categoryOf(i) === tab);
      const score = relevant.length + (seed === 0 ? 0 : noise(seed, p.id) * 2.5);
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export function filtersActive(f: DiscoverFilters, d: DiscoverFilters) {
  return f.maxKm !== d.maxKm || f.minAge !== d.minAge || f.maxAge !== d.maxAge || f.verifiedOnly !== d.verifiedOnly;
}
