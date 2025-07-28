"use client";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRelatedTracks } from "@/features/tracks/hooks/use-related-tracks";
import { useAudioPlayerStore } from "@/features/tracks/store/use-audio-player-store";

interface RelatedTracksProps {
  artist: string;
  currentTrackId: string;
}

export function RelatedTracks({ artist, currentTrackId }: RelatedTracksProps) {
  const { tracks, isLoading } = useRelatedTracks(artist);
  const { handlePlay } = useAudioPlayerStore();

  if (tracks.length === 1 && !isLoading) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">More from {artist}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          : tracks
              .filter((track) => track.id !== currentTrackId)
              .map((track) => (
                <Card
                  key={track.id}
                  className="group overflow-hidden rounded-xl border hover:shadow-md transition p-5"
                >
                  <Link href={`/tracks/${track.id}`} className="block">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={track.coverImage || "/placeholder-artwork.png"}
                        alt={track.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePlay(track);
                          }}
                          size="icon"
                          className="rounded-full w-12 h-12"
                          variant="outline"
                        >
                          <Play className="w-5 h-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-1">
                      <h3 className="font-medium truncate">{track.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artist}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
      </div>
    </div>
  );
}
