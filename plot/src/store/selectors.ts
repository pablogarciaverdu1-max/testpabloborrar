import { useMemo } from 'react';

import { categoryOf } from '@/data/catalog';
import { people } from '@/data/seed';
import type { CategoryId } from '@/theme';
import type { Conversation, Person, Post } from '@/types';

import { useApp, type AppState } from './useApp';

export const personById = (id: string): Person | undefined => people.find((p) => p.id === id);

export function shared(mine: string[], theirs: string[]) {
  return theirs.filter((i) => mine.includes(i));
}

export function others(mine: string[], theirs: string[]) {
  return theirs.filter((i) => !mine.includes(i));
}

/** Categoría dominante de los intereses en común (para «Os une»). */
export function mainSharedCategory(mine: string[], theirs: string[]): CategoryId | undefined {
  const s = shared(mine, theirs);
  return s.length ? categoryOf(s[0]) : undefined;
}

export const postsOf = (posts: Post[], authorId: string) =>
  posts.filter((p) => p.authorId === authorId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

/** Solicitudes visibles según ajustes, bloqueos y descartes. */
export function visibleRequests(s: Pick<AppState, 'conversations' | 'blocked' | 'settings' | 'me'>) {
  const all = Object.values(s.conversations).filter(
    (c) => c.status === 'request' && !c.dismissed && !s.blocked.includes(c.personId),
  );
  const allowed = all.filter((c) => {
    const p = personById(c.personId);
    if (!p) return false;
    if (s.settings.whoCanWrite === 'verified' && !p.verified) return false;
    if (s.settings.whoCanWrite === 'common' && shared(s.me.interests, p.interests).length === 0) return false;
    return true;
  });
  const filterOn = s.settings.offensiveFilter;
  return {
    normal: allowed.filter((c) => !(filterOn && c.filtered)),
    hidden: allowed.filter((c) => filterOn && c.filtered),
  };
}

export function visibleChats(s: Pick<AppState, 'conversations' | 'blocked'>): Conversation[] {
  return Object.values(s.conversations)
    .filter((c) => c.status === 'chat' && !c.dismissed && c.messages.length > 0 && !s.blocked.includes(c.personId))
    .sort((a, b) => lastAt(b).localeCompare(lastAt(a)));
}

export const lastAt = (c: Conversation) => c.messages[c.messages.length - 1]?.createdAt ?? '';

export function useChatBadge() {
  const conversations = useApp((s) => s.conversations);
  const blocked = useApp((s) => s.blocked);
  const settings = useApp((s) => s.settings);
  const me = useApp((s) => s.me);
  return useMemo(() => {
    const unread = visibleChats({ conversations, blocked }).reduce((n, c) => n + (c.muted ? 0 : c.unread), 0);
    const req = visibleRequests({ conversations, blocked, settings, me });
    return unread + req.normal.length;
  }, [conversations, blocked, settings, me]);
}
