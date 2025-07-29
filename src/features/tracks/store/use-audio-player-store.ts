import { create } from "zustand";

import { Track } from "../schemas/schemas";

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  handlePlay: (track: Track) => void;
  closePlayer: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,

  handlePlay: (track: Track) =>
    set((state) => {
      if (state.currentTrack?.id === track.id) {
        return { isPlaying: !state.isPlaying };
      }

      return { currentTrack: track, isPlaying: true };
    }),

  closePlayer: () =>
    set({
      currentTrack: null,
      isPlaying: false,
    }),
}));
