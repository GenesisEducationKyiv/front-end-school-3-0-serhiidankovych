"use client";

import dynamic from "next/dynamic";

import { ClientProvider } from "@/app/providers/query-client-provider";
import { useAudioPlayerStore } from "@/features/tracks/store/use-audio-player-store";

const AudioPlayer = dynamic(() =>
  import("@/features/tracks/components/ui/audio-player").then(
    (mod) => mod.AudioPlayer
  )
);

export default function TracksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTrack, isPlaying, handlePlay, closePlayer } =
    useAudioPlayerStore();

  return (
    <ClientProvider>
      <div className="relative min-h-screen">
        <main className={currentTrack ? "pb-24" : ""}>{children}</main>

        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-lg">
            <AudioPlayer
              track={currentTrack}
              isPlaying={isPlaying}
              handlePlay={handlePlay}
              onClose={closePlayer}
            />
          </div>
        )}
      </div>
    </ClientProvider>
  );
}
