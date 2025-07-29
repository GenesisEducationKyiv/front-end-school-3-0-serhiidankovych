import { createServerQueryClient } from "@/config/query-client";
import { api } from "@/features/tracks/api";

import { ComponentTrackFilters } from "../types";

export async function prefetchTracks(
  filters: ComponentTrackFilters,
  page: number,
  limit: number
) {
  const queryClient = createServerQueryClient();
  const queryParams = { ...filters, page, limit };

  try {
    await queryClient.prefetchQuery({
      queryKey: ["tracks", queryParams],
      queryFn: () => api.getTracks(queryParams),
    });

    return { queryClient, success: true };
  } catch (error) {
    console.error("Failed to prefetch tracks:", error);
    return { queryClient, success: false, error };
  }
}

export async function prefetchTrackDetail(trackId: string) {
  const queryClient = createServerQueryClient();

  try {
    const track = await queryClient.fetchQuery({
      queryKey: ["track", trackId],
      queryFn: () => api.getTrack(trackId),
    });

    if (track.artist) {
      await queryClient.prefetchQuery({
        queryKey: ["tracks", { artist: track.artist, limit: 5 }],
        queryFn: () =>
          api.getTracks({
            page: 1,
            limit: 5,
            search: "",
            genre: "",
            artist: track.artist,
            sort: "",
            order: "",
          }),
      });
    }

    return { queryClient, track, success: true };
  } catch (error) {
    console.error(`Failed to prefetch track ${trackId}:`, error);
    return { queryClient, success: false, error };
  }
}
