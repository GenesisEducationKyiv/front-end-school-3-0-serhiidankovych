"use client";

import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Track } from "@/features/tracks/schemas/schemas";

interface TrackPlayButtonProps {
  track: Track;
  isCurrentlyPlaying: boolean;
  onPlay: (track: Track) => void;
}

export const TrackPlayButton = ({
  track,
  isCurrentlyPlaying,
  onPlay,
}: TrackPlayButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className="absolute inset-0 bg-black/40 hover:bg-black/60 transition-colors h-full w-full rounded-none"
    onClick={() => onPlay(track)}
    title={isCurrentlyPlaying ? "Pause track" : "Play track"}
    data-testid={`play-button-${track.id}`}
  >
    {isCurrentlyPlaying ? (
      <Pause className="h-4 w-4 text-white" />
    ) : (
      <Play className="h-4 w-4 text-white" />
    )}
  </Button>
);
