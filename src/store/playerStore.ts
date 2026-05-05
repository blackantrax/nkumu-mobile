import { create } from 'zustand';
import { Track, Artist } from '../data/artists';

interface PlayerState {
  currentTrack: Track | null;
  currentArtist: Artist | null;
  isPlaying: boolean;
  progress: number; // 0-1
  duration: number;
  queue: Track[];

  play: (track: Track, artist: Artist) => void;
  pause: () => void;
  resume: () => void;
  seek: (progress: number) => void;
  setProgress: (progress: number) => void;
  togglePlay: () => void;
  skipNext: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  currentArtist: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  queue: [],

  play: (track, artist) => {
    set({ currentTrack: track, currentArtist: artist, isPlaying: true, progress: 0, duration: track.durationSec });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  seek: (progress) => set({ progress }),

  setProgress: (progress) => set({ progress }),

  skipNext: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const next = queue[idx + 1] ?? queue[0];
    if (next) set({ currentTrack: next, progress: 0, isPlaying: true });
  },
}));
