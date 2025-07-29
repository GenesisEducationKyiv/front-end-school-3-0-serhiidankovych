import { APP_CONFIG } from "@/config/app";
import { api } from "@/features/tracks/api";

export async function generateTrackStaticParams() {
  try {
    const allTracks = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= APP_CONFIG.TRACKS.MAX_STATIC_PAGES) {
      const response = await api.getTracks({
        page,
        limit: APP_CONFIG.TRACKS.STATIC_GENERATION_LIMIT,
        search: "",
        genre: "",
        artist: "",
        sort: "",
        order: "",
      });

      allTracks.push(...response.data);
      hasMore =
        response.data.length === APP_CONFIG.TRACKS.STATIC_GENERATION_LIMIT;
      page++;
    }

    return allTracks.map((track) => ({ id: track.id }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}
