import type { ImageSourcePropType } from 'react-native';

/**
 * Fotos reales incluidas en la app.
 * - avatarPhotos: retratos generados con IA (personas que no existen).
 * - postPhotos: fotos de paisajes y planes para las publicaciones de ejemplo.
 * Si una entrada falta, se muestra el diseño de color con iniciales o etiqueta.
 */
export const avatarPhotos: Record<string, ImageSourcePropType> = {};

export const postPhotos: Record<string, ImageSourcePropType> = {};
