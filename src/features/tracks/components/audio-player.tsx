"use client";

import { Music, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { useAudioPlayer } from "../hooks/use-audio-player";
import { Track } from "../schemas/schemas";

interface AudioPlayerProps {
  track: Track;
  onClose: () => void;
  handlePlay: (track: Track) => void;
  isPlaying: boolean;
}

export function AudioPlayer({
  track,
  onClose,
  handlePlay,
  isPlaying,
}: AudioPlayerProps) {
  const {
    waveformRef,
    currentTime,
    duration,
    volume,
    isMuted,
    isPlayPending,
    canPlay,
    handlePlayPause,
    toggleMute,
    setVolume,
    formatTime,
  } = useAudioPlayer({ track, isPlaying, handlePlay });

  return (
    <div className="p-3 bg-card text-card-foreground shadow-md max-w-full space-y-3 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-7 w-7 absolute top-2 right-2"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-center justify-start sm:justify-around gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-[100px]">
          <div className="relative h-[60px] w-[60px] rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {track.coverImage ? (
              <Image
                src={track.coverImage}
                alt={track.title}
                fill
                loading="lazy"
                className="object-cover"
              />
            ) : (
              <Music className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div className="text-sm">
            <p className="font-medium leading-tight">{track.title}</p>
            <p className="text-muted-foreground text-xs">{track.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={handlePlayPause}
            disabled={!canPlay || isPlayPending}
            className={`h-8 w-8 rounded-full ${
              isPlayPending ? "opacity-50" : ""
            }`}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <span className="text-xs text-muted-foreground min-w-[70px] text-center">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div
            ref={waveformRef}
            className="w-[200px] rounded bg-muted overflow-hidden"
          />

          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              disabled={!canPlay}
              className="h-7 w-7"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => setVolume(value[0])}
                disabled={!canPlay}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
