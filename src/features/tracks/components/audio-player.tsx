"use client";

import { useWavesurfer } from "@wavesurfer/react";
import { Music, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { api } from "../api/api";
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlayPending, setIsPlayPending] = useState(false);

  const waveformRef = useRef<HTMLDivElement>(null);

  const result = useMemo(() => {
    return api.getTrackAudioUrl(track.audioFile ?? null);
  }, [track.audioFile]);

  const { wavesurfer } = useWavesurfer({
    container: waveformRef,
    height: 30,
    waveColor: "#cbd5e1",
    progressColor: "#f0b100",
    cursorColor: "#886400",
    cursorWidth: 1,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    url: result ?? undefined,
  });

  useEffect(() => {
    if (!wavesurfer) return;

    const subs = [
      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration());
        setIsReady(true);
      }),
      wavesurfer.on("timeupdate", setCurrentTime),
      wavesurfer.on("finish", () => handlePlay(track)),
      wavesurfer.on("error", () => {
        setHasError(true);
        toast.error("Playback error", {
          description: "Failed to play audio track",
        });
      }),
    ];

    return () => subs.forEach((unsub) => unsub());
  }, [wavesurfer, track, handlePlay]);

  useEffect(() => {
    if (!wavesurfer || !isReady) return;

    if (isPlaying && !wavesurfer.isPlaying()) {
      setIsPlayPending(true);
      const playPromise = wavesurfer.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayPending(false);
          })
          .catch((error) => {
            if (error.name !== "AbortError") {
              toast.error("Playback error", {
                description: "Failed to play audio track (promise rejection)",
              });
            }
            setIsPlayPending(false);
          });
      } else {
        setIsPlayPending(false);
      }
    } else if (!isPlaying && wavesurfer.isPlaying() && !isPlayPending) {
      wavesurfer.pause();
    }
  }, [isPlaying, wavesurfer, isReady, isPlayPending]);

  useEffect(() => {
    if (wavesurfer) wavesurfer.setVolume(isMuted ? 0 : volume);
  }, [wavesurfer, volume, isMuted]);

  useEffect(() => {
    setHasError(false);
    setIsReady(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlayPending(false);
  }, [track.id]);

  const handlePlayPause = useCallback(() => {
    if (!wavesurfer || !result || hasError || !isReady || isPlayPending) return;
    handlePlay(track);
  }, [wavesurfer, result, hasError, isReady, isPlayPending, handlePlay, track]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const canPlay = !!result && !hasError;

  return (
    <div
      className="p-3 bg-card text-card-foreground shadow-md max-w-full space-y-3 relative"
      data-testid={`audio-player-${track.id}`}
    >
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
                unoptimized
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
            data-testid={
              isPlaying ? `pause-button-${track.id}` : `play-button-${track.id}`
            }
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
            data-testid={`audio-progress-${track.id}`}
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
