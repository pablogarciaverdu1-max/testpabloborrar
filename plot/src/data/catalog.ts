import type { CategoryId } from '@/theme';
import type { Activity, AppId, Place, Song } from '@/types';

/** Intereses disponibles, agrupados por categoría. */
export const interestCatalog: Record<CategoryId, string[]> = {
  music: ['Indie', 'Vinilos', 'Techno', 'Jazz', 'Conciertos', 'Rap', 'Pop', 'Flamenco'],
  sport: ['Running', 'Montaña', 'Escalada', 'Ciclismo', 'Yoga', 'Surf', 'Pádel', 'Natación'],
  food: ['Cocinar', 'Brunch', 'Vermut', 'Ramen', 'Vino natural', 'Café de especialidad', 'Mercados', 'Veggie'],
  places: ['Playa', 'Pirineo', 'Escapadas', 'Terrazas', 'Costa Brava', 'Miradores', 'Camping', 'Barrios'],
  culture: ['Cine', 'Libros', 'Museos', 'Teatro', 'Fotografía', 'Diseño', 'Cómics', 'Podcasts'],
};

const interestToCategory: Record<string, CategoryId> = Object.fromEntries(
  (Object.entries(interestCatalog) as [CategoryId, string[]][]).flatMap(([cat, list]) =>
    list.map((label) => [label, cat] as const),
  ),
);

export function categoryOf(interest: string): CategoryId {
  return interestToCategory[interest] ?? 'culture';
}

export const appInfo: Record<AppId, { name: string; description: string; category: CategoryId }> = {
  spotify: { name: 'Spotify', description: 'Comparte lo que escuchas', category: 'music' },
  strava: { name: 'Strava', description: 'Tus rutas y entrenos', category: 'sport' },
  maps: { name: 'Google Maps', description: 'Tus sitios favoritos', category: 'places' },
  photos: { name: 'Fotos', description: 'Elige fotos de tu carrete', category: 'culture' },
};

export const appOrder: AppId[] = ['spotify', 'strava', 'maps', 'photos'];

export const songs: Song[] = [
  { id: 's1', title: 'Luz de agosto', artist: 'Las Mareas Lentas', duration: '3:42' },
  { id: 's2', title: 'Terraza sur', artist: 'Club Ventisca', duration: '4:05' },
  { id: 's3', title: 'Domingo largo', artist: 'Nora Valle', duration: '3:18' },
  { id: 's4', title: 'Pájaros de neón', artist: 'Los Satélites Mudos', duration: '2:57' },
  { id: 's5', title: 'Carretera secundaria', artist: 'Bruma', duration: '5:11' },
  { id: 's6', title: 'Hielo fino', artist: 'Ada Ferrán', duration: '3:36' },
  { id: 's7', title: 'Verano en Sants', artist: 'Tranvía 48', duration: '3:03' },
  { id: 's8', title: 'Lo que queda', artist: 'Marea Baja', duration: '4:22' },
  { id: 's9', title: 'Nadie en la playa', artist: 'Los Satélites Mudos', duration: '3:49' },
  { id: 's10', title: 'Cumbre', artist: 'Pol Arenas', duration: '6:02' },
  { id: 's11', title: 'Ciudad dormida', artist: 'Nora Valle', duration: '3:27' },
  { id: 's12', title: 'Fuego lento', artist: 'Cocina Atómica', duration: '2:48' },
  { id: 's13', title: 'Ventanas abiertas', artist: 'Club Ventisca', duration: '3:55' },
  { id: 's14', title: 'Mapa de papel', artist: 'Ada Ferrán', duration: '4:10' },
  { id: 's15', title: 'Última sesión', artist: 'Delta Norte', duration: '7:15' },
];

export const activities: Activity[] = [
  { id: 'a1', title: 'Rodaje por Collserola', km: 10.2, pace: '5:12 /km', elevation: 180, kind: 'Carrera' },
  { id: 'a2', title: 'Series en la Diagonal', km: 8.0, pace: '4:31 /km', elevation: 25, kind: 'Carrera' },
  { id: 'a3', title: 'Carretera de les Aigües', km: 14.6, pace: '5:40 /km', elevation: 240, kind: 'Carrera' },
  { id: 'a4', title: 'Subida al Tibidabo', km: 32.4, pace: '22,1 km/h', elevation: 610, kind: 'Bici' },
  { id: 'a5', title: 'Cim del Pedraforca', km: 11.8, pace: '2:45 h', elevation: 1150, kind: 'Senderismo' },
  { id: 'a6', title: 'Bunkers al amanecer', km: 6.3, pace: '5:55 /km', elevation: 150, kind: 'Carrera' },
  { id: 'a7', title: 'Camí de Ronda', km: 18.0, pace: '4:10 h', elevation: 420, kind: 'Senderismo' },
  { id: 'a8', title: 'Vuelta al Garraf', km: 64.5, pace: '25,4 km/h', elevation: 890, kind: 'Bici' },
];

export const places: Place[] = [
  { id: 'p1', name: 'Bunkers del Carmel', area: 'Barcelona', kind: 'Mirador' },
  { id: 'p2', name: 'Pedraforca', area: 'Berguedà', kind: 'Montaña' },
  { id: 'p3', name: 'Mercat de Sant Antoni', area: 'Barcelona', kind: 'Mercado' },
  { id: 'p4', name: 'Cap de Creus', area: 'Alt Empordà', kind: 'Parque natural' },
  { id: 'p5', name: 'Montserrat', area: 'Bages', kind: 'Montaña' },
  { id: 'p6', name: 'Parc de la Ciutadella', area: 'Barcelona', kind: 'Parque' },
  { id: 'p7', name: 'Carretera de les Aigües', area: 'Collserola', kind: 'Ruta' },
  { id: 'p8', name: 'Platja de la Mar Bella', area: 'Barcelona', kind: 'Playa' },
  { id: 'p9', name: 'Calella de Palafrugell', area: 'Baix Empordà', kind: 'Pueblo de costa' },
  { id: 'p10', name: 'Mercat de la Llibertat', area: 'Gràcia, Barcelona', kind: 'Mercado' },
  { id: 'p11', name: 'Taberna La Ola', area: 'Barceloneta, Barcelona', kind: 'Restaurante' },
  { id: 'p12', name: 'Koto Ramen', area: 'Sant Antoni, Barcelona', kind: 'Restaurante' },
  { id: 'p13', name: 'Bodega Vermella', area: 'Poblenou, Barcelona', kind: 'Vermutería' },
  { id: 'p14', name: 'Casa Brava', area: 'Gràcia, Barcelona', kind: 'Restaurante' },
  { id: 'p15', name: 'Forn de l’Àvia', area: 'Horta, Barcelona', kind: 'Brunch' },
];

export const songById = (id?: string) => songs.find((s) => s.id === id);
export const activityById = (id?: string) => activities.find((a) => a.id === id);
export const placeById = (id?: string) => places.find((p) => p.id === id);
