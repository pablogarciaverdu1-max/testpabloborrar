import { activityById, placeById, songById } from '@/data/catalog';
import type { Message } from '@/types';

export function messagePreview(m: Message): string {
  if (m.text) return m.text;
  const a = m.attachment;
  if (!a) return '';
  switch (a.type) {
    case 'song':
      return `Canción: ${songById(a.refId)?.title ?? ''}`;
    case 'activity':
      return `Actividad: ${activityById(a.refId)?.title ?? ''}`;
    case 'place':
      return `Lugar: ${placeById(a.refId)?.name ?? ''}`;
    case 'photo':
      return 'Foto';
  }
}
