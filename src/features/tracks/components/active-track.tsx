"use client";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { api } from "../api/api";

export default function ActiveTrackDisplay() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = api.subscribeToActiveTrack((newTrackName) => {
      setActiveTrack(newTrackName);
      setIsLoading(false);
    });

    const handleBeforeUnload = () => {
      unsubscribe();
    };

    const handlePageHide = () => {
      unsubscribe();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex h-6 w-[200px] items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
      </span>
      <span className="flex-shrink-0 text-muted-foreground">Now Playing:</span>
      <div
        className="flex h-full min-w-[160px] max-w-[160px] items-center truncate font-medium"
        aria-live="polite"
      >
        {isLoading ? (
          <span className="inline-block w-full truncate">
            <Skeleton className="inline-block h-5 w-[160px] align-middle" />
          </span>
        ) : (
          <span className="inline-block w-full truncate">
            {activeTrack || "No track active"}
          </span>
        )}
      </div>
    </div>
  );
}
