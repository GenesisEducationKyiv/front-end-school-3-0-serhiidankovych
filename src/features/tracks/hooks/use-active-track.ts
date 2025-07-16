import { useEffect, useState } from "react";

import { api } from "../api/api";

export function useActiveTrack() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = api.subscribeToActiveTrack((newTrackName) => {
      setActiveTrack(newTrackName);
      setIsLoading(false);
    });

    const handleBeforeUnload = () => unsubscribe();
    const handlePageHide = () => unsubscribe();

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      unsubscribe();
    };
  }, []);

  return { activeTrack, isLoading };
}
