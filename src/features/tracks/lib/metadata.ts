import { api } from "@/features/tracks/api";

import { SearchParams } from "../types";

export async function generateTrackMetadata(trackId: string) {
  try {
    const track = await api.getTrack(trackId);
    return {
      title: `${track.title} - ${track.artist}`,
      description: `Listen to ${track.title} by ${track.artist}`,
      openGraph: {
        title: `${track.title} - ${track.artist}`,
        description: `Listen to ${track.title} by ${track.artist}`,
        type: "music.song",
      },
    };
  } catch (error) {
    return {
      title: "Track Not Found",
      description: "The requested track could not be found.",
    };
  }
}

export async function generateTracksMetadata(searchParams: SearchParams) {
  const { search, genre, artist } = searchParams;

  let title = "Music Tracks";
  let description = "Discover and explore music tracks";

  if (search) {
    title = `Search: ${search} - Music Tracks`;
    description = `Search results for "${search}"`;
  } else if (genre) {
    title = `${genre} Music - Tracks`;
    description = `Explore ${genre} music tracks`;
  } else if (artist) {
    title = `${artist} - Music Tracks`;
    description = `Tracks by ${artist}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}
