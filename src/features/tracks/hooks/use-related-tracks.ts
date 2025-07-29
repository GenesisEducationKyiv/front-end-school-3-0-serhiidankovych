import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { api } from "@/features/tracks/api";
import { Track } from "@/features/tracks/schemas/schemas";

export function useRelatedTracksQuery(artist?: string, limit = 5) {
  const { data, ...rest } = useQuery({
    queryKey: ["tracks", { artist, limit }],
    queryFn: () =>
      api.getTracks({
        page: 1,
        limit,
        artist: artist || "",
        search: "",
        genre: "",
        sort: "",
        order: "",
      }),
    enabled: !!artist,
  });

  const tracks: Track[] = useMemo(() => data?.data || [], [data]);

  return { tracks, ...rest };
}
