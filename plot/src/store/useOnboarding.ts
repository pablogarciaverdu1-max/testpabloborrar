import { create } from 'zustand';

type OnboardingDraft = {
  interests: string[];
  toggle: (label: string) => void;
  reset: () => void;
};

/** Borrador del onboarding (no se persiste hasta terminar). */
export const useOnboarding = create<OnboardingDraft>((set) => ({
  interests: [],
  toggle: (label) =>
    set((s) => ({
      interests: s.interests.includes(label) ? s.interests.filter((i) => i !== label) : [...s.interests, label],
    })),
  reset: () => set({ interests: [] }),
}));
