export * from './colors';
export * from './typography';

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Margen lateral de pantalla. */
export const gutter = 16;
/** Separación entre tarjetas. */
export const cardGap = 12;

export const radius = {
  chip: 999,
  button: 15,
  input: 14,
  card: 24,
  cardLg: 28,
  tile: 16,
} as const;

/** Zona táctil mínima (HIG). */
export const hit = 44;

/** Trazo de los iconos estilo SF Symbols. */
export const iconStroke = 1.8;

export const motion = {
  fast: 200,
  base: 250,
  slow: 300,
  spring: { damping: 18, stiffness: 220, mass: 0.9 },
} as const;
