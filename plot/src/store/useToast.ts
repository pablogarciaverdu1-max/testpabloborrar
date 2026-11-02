import { create } from 'zustand';

export type ToastTone = 'default' | 'success' | 'danger';

type ToastData = {
  id: number;
  message: string;
  tone: ToastTone;
  undo?: () => void;
};

type ToastState = {
  toast: ToastData | null;
  show: (message: string, opts?: { undo?: () => void; tone?: ToastTone }) => void;
  hide: () => void;
};

let nextId = 1;

export const useToast = create<ToastState>((set) => ({
  toast: null,
  show: (message, opts) => {
    nextId += 1;
    set({ toast: { id: nextId, message, tone: opts?.tone ?? 'default', undo: opts?.undo } });
  },
  hide: () => set({ toast: null }),
}));

export const toast = (message: string, opts?: { undo?: () => void; tone?: ToastTone }) =>
  useToast.getState().show(message, opts);
