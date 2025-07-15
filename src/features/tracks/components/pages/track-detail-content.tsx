"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  Edit,
  Pause,
  Play,
  Share2,
  Upload,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/features/tracks/api/api";
import { RelatedTracks } from "@/features/tracks/components/ui/related.tracks";
import { Track } from "@/features/tracks/schemas/schemas";
import { useAudioPlayerStore } from "@/features/tracks/store/use-audio-player-store";

const TrackModal = dynamic(() =>
  import("@/features/tracks/components/modals/track-modal").then(
    (mod) => mod.TrackModal
  )
);

const UploadTrackModal = dynamic(() =>
  import("@/features/tracks/components/modals/upload-track-modal").then(
    (mod) => mod.UploadTrackModal
  )
);

interface TrackDetailContentProps {
  trackId: string;
  initialTrack: Track;
}

export function TrackDetailContent({
  trackId,
  initialTrack,
}: TrackDetailContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentTrack, isPlaying, handlePlay, closePlayer } =
    useAudioPlayerStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const {
    data: track,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["track", trackId],
    queryFn: () => api.getTrack(trackId),
    initialData: initialTrack,
    refetchOnWindowFocus: false,
  });

  const handlePlayTrack = () => {
    if (track) {
      handlePlay(track);
    }
  };

  const handleEditTrack = () => {
    if (track) {
      setIsEditModalOpen(true);
    }
  };

  const handleUploadTrack = () => {
    if (track) {
      setIsUploadModalOpen(true);
    }
  };

  const handleShare = async () => {
    if (!track) return;
    const shareData = {
      title: `${track.title} - ${track.artist}`,
      text: `Check out this track: ${track.title} by ${track.artist}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleDownload = () => {
    if (track?.audioFile) {
      const audioUrl = api.getTrackAudioUrl(track.audioFile);
      const link = document.createElement("a");
      link.href = audioUrl ?? "";
      link.setAttribute("download", `${track.artist} - ${track.title}.mp3`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["track", trackId] });
    queryClient.invalidateQueries({ queryKey: ["tracks"] });
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl p-4 sm:p-8 min-h-screen">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Track Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The track you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/tracks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tracks
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !track) {
    return (
      <div className="container mx-auto max-w-4xl p-4 sm:p-8 min-h-screen">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Loading Track...</h1>
        </div>
      </div>
    );
  }

  const isCurrentTrackPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <>
      <div className="container mx-auto max-w-4xl p-4 sm:p-8 min-h-screen">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={() => router.push("/tracks")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tracks
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditTrack}
                aria-label="Edit Track"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadTrack}
                aria-label="Upload Audio"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                aria-label="Share Track"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                aria-label="Download Track"
                disabled={!track.audioFile}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mb-8 items-stretch">
          <div className="md:col-span-2 relative group min-h-[300px]">
            <Image
              src={track.coverImage || "/placeholder-cover.jpg"}
              alt={`${track.title} cover`}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="lg"
                onClick={handlePlayTrack}
                className="rounded-full w-16 h-16"
                aria-label={
                  isCurrentTrackPlaying ? "Pause Track" : "Play Track"
                }
                disabled={!track.audioFile}
              >
                {isCurrentTrackPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
            </div>
          </div>

          <div className="md:col-span-3">
            <Card className="h-full flex flex-col">
              <CardContent className="p-6 flex flex-col justify-between flex-grow">
                <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
                <h2 className="text-xl text-muted-foreground mb-4">
                  {track.artist}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {track.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Album:</span>
                    <span>{track.album || "Single"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Released:</span>
                    <span>
                      {new Date(track.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <RelatedTracks artist={track.artist} currentTrackId={track.id} />
      </div>

      <TrackModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
        track={track}
        mode="edit"
      />

      <UploadTrackModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        track={track}
        onSuccess={handleSuccess}
      />
    </>
  );
}
