"use client";

import { useCallback, useState } from "react";

import { Track } from "@/lib/schemas";

export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(
    (track: Track) => {
      if (currentTrack?.id === track.id) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    },
    [currentTrack, isPlaying]
  );

  const closePlayer = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  return {
    currentTrack,
    isPlaying,
    handlePlay,
    closePlayer,
  };
}
