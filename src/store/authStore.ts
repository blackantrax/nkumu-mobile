import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  onboardingDone: boolean;
  tasteDone: boolean;
  user: { name: string; email: string; phone?: string; isArtist?: boolean; artistId?: string } | null;

  login: (user: { name: string; email: string; isArtist?: boolean; artistId?: string }) => void;
  logout: () => void;
  completeOnboarding: () => void;
  completeTaste: () => void;
  switchToArtistMode: (artistId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  onboardingDone: false,
  tasteDone: false,
  user: null,

  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null, onboardingDone: false, tasteDone: false }),
  completeOnboarding: () => set({ onboardingDone: true }),
  completeTaste: () => set({ tasteDone: true }),
  switchToArtistMode: (artistId) =>
    set((state) => ({ user: state.user ? { ...state.user, isArtist: true, artistId } : null })),
}));
