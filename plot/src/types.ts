import type { CategoryId } from '@/theme';

export type AppId = 'spotify' | 'strava' | 'maps' | 'photos';

export type PostType = 'photo' | 'status' | 'song' | 'activity' | 'place';

export type Visibility = 'everyone' | 'common';

export type Post = {
  id: string;
  authorId: string;
  type: PostType;
  createdAt: string;
  text?: string;
  /** Foto simulada: bloque de color con etiqueta. */
  photoLabel?: string;
  /** Foto real elegida del carrete. */
  photoUri?: string;
  songId?: string;
  activityId?: string;
  placeId?: string;
  /** Interés etiquetado (opcional). */
  tag?: string;
  /** Color de la publicación (categoría). */
  category: CategoryId;
  visibility: Visibility;
};

export type Person = {
  id: string;
  name: string;
  age: number;
  hood: string;
  km: number;
  verified: boolean;
  bio: string;
  interests: string[];
  apps: AppId[];
  color: CategoryId;
  reason: string;
  icebreakers: string[];
  replies: string[];
  /** Perfiles que no aparecen en Descubrir (p. ej. el de la solicitud filtrada). */
  hiddenFromDiscover?: boolean;
};

export type Me = {
  name: string;
  age: number;
  hood: string;
  bio: string;
  interests: string[];
  color: CategoryId;
};

export type Song = { id: string; title: string; artist: string; duration: string };
export type Activity = {
  id: string;
  title: string;
  km: number;
  pace: string;
  elevation: number;
  kind: 'Carrera' | 'Bici' | 'Senderismo';
};
export type Place = { id: string; name: string; area: string; kind: string };

export type Attachment =
  | { type: 'song'; refId: string }
  | { type: 'activity'; refId: string }
  | { type: 'place'; refId: string }
  | { type: 'photo'; uri: string };

export type Message = {
  id: string;
  from: 'me' | string;
  createdAt: string;
  text?: string;
  attachment?: Attachment;
  /** Publicación citada (mía o suya). */
  quotedPostId?: string;
  /** Pregunta de ligue enviada desde la burbuja. */
  questionId?: string;
};

export type ConversationStatus = 'chat' | 'request';

export type Conversation = {
  personId: string;
  status: ConversationStatus;
  messages: Message[];
  unread: number;
  muted: boolean;
  /** Mi publicación desde la que la otra persona empezó a hablar. */
  startedFromPostId?: string;
  /** Solicitud oculta por el filtro de lenguaje ofensivo. */
  filtered?: boolean;
  /** Solicitud ignorada o conversación eliminada. */
  dismissed?: boolean;
  /** Mi último mensaje ya fue leído por la otra persona. */
  seen?: boolean;
};

export type WhoCanWrite = 'everyone' | 'verified' | 'common';

export type Settings = {
  whoCanWrite: WhoCanWrite;
  offensiveFilter: boolean;
  showDistance: boolean;
  notifications: boolean;
};

export type DiscoverFilters = {
  maxKm: number;
  minAge: number;
  maxAge: number;
  verifiedOnly: boolean;
};
