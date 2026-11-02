import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { answerFor } from '@/data/flirt';
import { createSeed, people } from '@/data/seed';
import type {
  AppId,
  Attachment,
  Conversation,
  DiscoverFilters,
  Me,
  Message,
  Post,
  Settings,
} from '@/types';
import { uid } from '@/utils/id';

export const defaultFilters: DiscoverFilters = { maxKm: 10, minAge: 18, maxAge: 40, verifiedOnly: false };

const defaultSettings: Settings = {
  whoCanWrite: 'everyone',
  offensiveFilter: true,
  showDistance: true,
  notifications: true,
};

type PersistedState = {
  loggedIn: boolean;
  onboarded: boolean;
  me: Me;
  posts: Post[];
  conversations: Record<string, Conversation>;
  blocked: string[];
  apps: Record<AppId, boolean>;
  settings: Settings;
  filters: DiscoverFilters;
  discoverSeed: number;
  replyIndex: Record<string, number>;
};

type RuntimeState = {
  /** Conversación abierta ahora mismo (para no marcar no leídos). */
  activeChat: string | null;
  /** Personas que están «escribiendo…». */
  typing: Record<string, boolean>;
  hydrated: boolean;
};

type Actions = {
  setHydrated: () => void;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
  resetDemo: () => void;

  updateMe: (patch: Partial<Me>) => void;
  setApp: (app: AppId, on: boolean) => void;
  setSettings: (patch: Partial<Settings>) => void;
  setFilters: (f: DiscoverFilters) => void;
  shuffleDiscover: () => void;

  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'authorId'>) => void;
  updatePost: (id: string, text: string) => void;
  deletePost: (id: string) => Post | undefined;
  restorePost: (post: Post) => void;

  setActiveChat: (id: string | null) => void;
  markRead: (id: string) => void;
  sendMessage: (personId: string, msg: { text?: string; attachment?: Attachment; quotedPostId?: string; questionId?: string }) => void;
  deleteMessage: (personId: string, messageId: string) => void;
  acceptRequest: (personId: string) => void;
  setDismissed: (personId: string, dismissed: boolean) => void;
  setMuted: (personId: string, muted: boolean) => void;

  block: (personId: string) => void;
  unblock: (personId: string) => void;
};

export type AppState = PersistedState & RuntimeState & Actions;

function initialData(): PersistedState {
  const seed = createSeed();
  return {
    loggedIn: false,
    // La cuenta de Marc ya existe en la demo: entrar con contraseña lleva directo a Descubrir.
    // «Crear cuenta» siempre recorre el onboarding.
    onboarded: true,
    me: seed.me,
    posts: seed.posts,
    conversations: seed.conversations,
    blocked: [],
    apps: { spotify: true, strava: true, maps: false, photos: false },
    settings: { ...defaultSettings },
    filters: { ...defaultFilters },
    discoverSeed: 0,
    replyIndex: {},
  };
}

const replyTimers = new Map<string, ReturnType<typeof setTimeout>[]>();

function clearTimers() {
  replyTimers.forEach((list) => list.forEach(clearTimeout));
  replyTimers.clear();
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialData(),
      activeChat: null,
      typing: {},
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),
      login: () => set({ loggedIn: true }),
      logout: () => {
        clearTimers();
        set({ loggedIn: false, typing: {}, activeChat: null });
      },
      completeOnboarding: () => set({ onboarded: true, loggedIn: true }),
      resetDemo: () => {
        clearTimers();
        set({ ...initialData(), typing: {}, activeChat: null });
      },

      updateMe: (patch) => set((s) => ({ me: { ...s.me, ...patch } })),
      setApp: (app, on) => set((s) => ({ apps: { ...s.apps, [app]: on } })),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setFilters: (filters) => set({ filters }),
      shuffleDiscover: () => set((s) => ({ discoverSeed: s.discoverSeed + 1 })),

      addPost: (post) =>
        set((s) => ({
          posts: [{ ...post, id: uid('post'), authorId: 'me', createdAt: new Date().toISOString() }, ...s.posts],
        })),
      updatePost: (id, text) =>
        set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, text } : p)) })),
      deletePost: (id) => {
        const post = get().posts.find((p) => p.id === id);
        set((s) => ({ posts: s.posts.filter((p) => p.id !== id) }));
        return post;
      },
      restorePost: (post) =>
        set((s) => ({
          posts: [...s.posts, post].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        })),

      setActiveChat: (id) => set({ activeChat: id }),
      markRead: (id) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c || c.unread === 0 || c.status !== 'chat') return s;
          return { conversations: { ...s.conversations, [id]: { ...c, unread: 0 } } };
        }),

      sendMessage: (personId, msg) => {
        const now = new Date().toISOString();
        const message: Message = { id: uid('msg'), from: 'me', createdAt: now, ...msg };
        set((s) => {
          const existing: Conversation = s.conversations[personId] ?? {
            personId,
            status: 'chat',
            messages: [],
            unread: 0,
            muted: false,
          };
          return {
            conversations: {
              ...s.conversations,
              [personId]: {
                ...existing,
                status: 'chat',
                dismissed: false,
                unread: 0,
                seen: false,
                messages: [...existing.messages, message],
              },
            },
          };
        });
        scheduleReply(personId, msg.questionId);
      },

      deleteMessage: (personId, messageId) =>
        set((s) => {
          const c = s.conversations[personId];
          if (!c) return s;
          return {
            conversations: {
              ...s.conversations,
              [personId]: { ...c, messages: c.messages.filter((m) => m.id !== messageId) },
            },
          };
        }),

      acceptRequest: (personId) =>
        set((s) => {
          const c = s.conversations[personId];
          if (!c) return s;
          return {
            conversations: {
              ...s.conversations,
              [personId]: { ...c, status: 'chat', unread: 0, filtered: false, dismissed: false },
            },
          };
        }),

      setDismissed: (personId, dismissed) =>
        set((s) => {
          const c = s.conversations[personId];
          if (!c) return s;
          return { conversations: { ...s.conversations, [personId]: { ...c, dismissed } } };
        }),

      setMuted: (personId, muted) =>
        set((s) => {
          const existing: Conversation = s.conversations[personId] ?? {
            personId,
            status: 'chat',
            messages: [],
            unread: 0,
            muted: false,
          };
          return { conversations: { ...s.conversations, [personId]: { ...existing, muted } } };
        }),

      block: (personId) => {
        replyTimers.get(personId)?.forEach(clearTimeout);
        replyTimers.delete(personId);
        set((s) => ({
          blocked: s.blocked.includes(personId) ? s.blocked : [...s.blocked, personId],
          typing: { ...s.typing, [personId]: false },
        }));
      },
      unblock: (personId) => set((s) => ({ blocked: s.blocked.filter((id) => id !== personId) })),
    }),
    {
      name: 'plot-demo',
      // v2: categoría Restaurantes, más publicaciones y fotos reales. Al subir de versión se carga la demo nueva.
      version: 2,
      migrate: () => initialData(),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): PersistedState => ({
        loggedIn: s.loggedIn,
        onboarded: s.onboarded,
        me: s.me,
        posts: s.posts,
        conversations: s.conversations,
        blocked: s.blocked,
        apps: s.apps,
        settings: s.settings,
        filters: s.filters,
        discoverSeed: s.discoverSeed,
        replyIndex: s.replyIndex,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

/** Simula que la otra persona lee, escribe y responde en 1,5–2,5 s. */
function scheduleReply(personId: string, questionId?: string) {
  const person = people.find((p) => p.id === personId);
  if (!person || person.replies.length === 0) return;

  replyTimers.get(personId)?.forEach(clearTimeout);
  const delay = 1500 + Math.round(Math.random() * 1000);

  const seenTimer = setTimeout(() => {
    useApp.setState((s) => {
      const c = s.conversations[personId];
      if (!c) return s;
      return {
        typing: { ...s.typing, [personId]: true },
        conversations: { ...s.conversations, [personId]: { ...c, seen: true } },
      };
    });
  }, 450);

  const replyTimer = setTimeout(() => {
    const s = useApp.getState();
    const c = s.conversations[personId];
    if (!c || s.blocked.includes(personId)) {
      useApp.setState({ typing: { ...s.typing, [personId]: false } });
      return;
    }
    const index = s.replyIndex[personId] ?? 0;
    const answer = questionId ? answerFor(questionId, personId) : undefined;
    const text = answer ?? person.replies[index % person.replies.length];
    const reply: Message = { id: uid('msg'), from: personId, createdAt: new Date().toISOString(), text };
    const viewing = s.activeChat === personId;
    useApp.setState({
      typing: { ...s.typing, [personId]: false },
      replyIndex: answer ? s.replyIndex : { ...s.replyIndex, [personId]: index + 1 },
      conversations: {
        ...s.conversations,
        [personId]: {
          ...c,
          messages: [...c.messages, reply],
          unread: viewing ? 0 : c.unread + 1,
        },
      },
    });
    replyTimers.delete(personId);
  }, delay);

  replyTimers.set(personId, [seenTimer, replyTimer]);
}
