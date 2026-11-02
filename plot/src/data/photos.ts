import type { ImageSourcePropType } from 'react-native';

/**
 * Fotos reales de Unsplash (licencia libre de Unsplash), cargadas por enlace.
 * Necesitan internet en el móvil. Si una no carga, la app muestra el diseño de color.
 */
const u = (id: string, w = 900): ImageSourcePropType => ({
  uri: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`,
});

/** Retratos de perfil. */
export const avatarPhotos: Record<string, ImageSourcePropType> = {
  me: u('1507003211169-0a1dd7228f2d', 300),
  laia: u('1494790108377-be9c29b29330', 300),
  nerea: u('1438761681033-6461ffad8d80', 300),
  alex: u('1500648767791-00dcc994a43e', 300),
  clara: u('1544005313-94ddf0286df2', 300),
  jordi: u('1506794778202-cad84cf45f1d', 300),
  paula: u('1534528741775-53994a69daeb', 300),
  sergi: u('1472099645785-5658abf4ff4e', 300),
  irene: u('1517841905240-472988babdf9', 300),
  dani: u('1539571696357-5a69c17a67c6', 300),
};

/** Foto de cada publicación de ejemplo (paisajes, rutas, restaurantes, conciertos…). */
export const postPhotos: Record<string, ImageSourcePropType> = {
  // Marc
  m1: u('1493225457124-a3eb161ffa5f'),
  m2: u('1476480862126-209bfaa8edc8'),
  m3: u('1464822759023-fed622ff2c3b'),
  m5: u('1488459716781-31db52582fe9'),
  m6: u('1461360228754-6e81c478b882'),
  // Laia
  l1: u('1552674605-db6ffd4facb5'),
  l2: u('1506905925346-21bda4d32df4'),
  l3: u('1501386761578-eac5c94b800a'),
  l4: u('1507525428034-b723cf961d3e'),
  l5: u('1517248135467-4c7edcad34c4'),
  l6: u('1460661419201-fd4cecdf8a8b'),
  // Nerea
  n1: u('1461360228754-6e81c478b882'),
  n2: u('1481627834876-b7833e8f5570'),
  n4: u('1569718212165-3a8278d5f624'),
  // Álex
  x1: u('1470225620780-dba8ba36b745'),
  x2: u('1517836357463-d25dfeac3438'),
  x4: u('1516450360452-9312f5e86fc7'),
  x5: u('1583422409516-2895a77efded'),
  // Clara
  c1: u('1504674900247-0877df9cc836'),
  c2: u('1507525428034-b723cf961d3e'),
  c4: u('1507838153414-b4b713384a76'),
  c5: u('1555396273-367ea4eb4db5'),
  // Jordi
  j1: u('1541625602330-2277a4c46182'),
  j2: u('1500530855697-b586d89ba3ee'),
  j3: u('1515443961218-a51367888e4b'),
  j4: u('1464822759023-fed622ff2c3b'),
  j5: u('1511671782779-c97d3d27a1d4'),
  // Paula
  pa1: u('1493225457124-a3eb161ffa5f'),
  pa2: u('1452780212940-6f5c0d14d848'),
  pa4: u('1539037116277-4db20889f2d4'),
  // Sergi
  se1: u('1502680390469-be75c86b636f'),
  se3: u('1470225620780-dba8ba36b745'),
  se4: u('1414235077428-338989a2e8c0'),
  se5: u('1507525428034-b723cf961d3e'),
  // Irene
  i2: u('1522163182402-834f871fd851'),
  i3: u('1489599849927-2ee91cede3ba'),
  i4: u('1506905925346-21bda4d32df4'),
  i5: u('1525351484163-7529414344d8'),
};
