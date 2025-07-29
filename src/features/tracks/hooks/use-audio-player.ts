import { useWavesurfer } from "@wavesurfer/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { api } from "@/features/tracks/api";
import { Track } from "@/features/tracks/schemas/schemas";

export function useAudioPlayer({
  track,
  isPlaying,
  handlePlay,
}: {
  track: Track;
  isPlaying: boolean;
  handlePlay: (track: Track) => void;
}) {
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
      wavesurfer
        .play()
        ?.catch((error) => {
          if (error.name !== "AbortError") {
            toast.error("Playback error", {
              description: "Failed to play audio track (promise rejection)",
            });
          }
        })
        .finally(() => setIsPlayPending(false));
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

  return {
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
  };
}
