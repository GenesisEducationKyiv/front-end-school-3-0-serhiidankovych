export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  slug: string;
  coverImage: string;
  audioFile: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TrackFormData {
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  genres: string[];
}

export type TrackSort = "title" | "artist" | "album" | "createdAt";
export type TrackOrder = "asc" | "desc";

export interface ComponentTrackFilters {
  search: string;
  genre: string;
  artist: string;
  sort: TrackSort;
  order: TrackOrder;
}

// Type guard to validate a string is a valid TrackSort
export function isTrackSort(value: unknown): value is TrackSort {
  return (
    typeof value === "string" &&
    ["title", "artist", "album", "createdAt"].includes(value)
  );
}

// Type guard to validate a string is a valid TrackOrder
export function isTrackOrder(value: unknown): value is TrackOrder {
  return typeof value === "string" && ["asc", "desc"].includes(value);
}

export interface TrackFilters {
  search: string;
  genre: string;
  artist: string;
  sort: string;
  page: number;
  limit: number;
  order: string;
}
