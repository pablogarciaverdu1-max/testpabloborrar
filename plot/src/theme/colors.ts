export const colors = {
  ink: '#14121F',
  text2: '#4B4860',
  text3: '#6E6A85',
  line: '#E8E5F0',
  surface: '#F5F3FA',
  bg: '#FFFFFF',
  white: '#FFFFFF',
  danger: '#E5243B',
  dangerSoft: '#FFE8EB',
  dangerInk: '#B0102A',
  primary: '#6B3CF5',
  primarySoft: '#EEE8FF',
  primaryInk: '#4A1FD0',
  success: '#1FCB94',
  /** Velo oscuro para fondos de hojas y modales (ink al 45 %). */
  scrim: 'rgba(20, 18, 31, 0.45)',
  /** Blanco translúcido para textos secundarios sobre violeta. */
  onPrimaryMuted: 'rgba(255, 255, 255, 0.82)',
  /** Fondo de botones circulares sobre portadas de color. */
  glass: 'rgba(255, 255, 255, 0.92)',
  transparent: 'transparent',
} as const;

export type CategoryId = 'music' | 'sport' | 'food' | 'places' | 'culture';

export type CategoryPalette = { solid: string; soft: string; ink: string; label: string };

export const categories: Record<CategoryId, CategoryPalette> = {
  music: { solid: '#FF4D94', soft: '#FFE5F0', ink: '#B8165A', label: 'Música' },
  sport: { solid: '#FF7A33', soft: '#FFE9DC', ink: '#B24A0E', label: 'Deporte' },
  food: { solid: '#FFC93C', soft: '#FFF4CF', ink: '#8A5A00', label: 'Restaurantes' },
  places: { solid: '#1FCB94', soft: '#DDF8EE', ink: '#0B7A57', label: 'Lugares' },
  culture: { solid: '#3B9BFF', soft: '#E2F0FF', ink: '#0B5FB8', label: 'Cultura' },
};

export const categoryOrder: CategoryId[] = ['music', 'sport', 'food', 'places', 'culture'];
