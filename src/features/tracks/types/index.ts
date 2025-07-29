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

export interface TrackFormData {
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  genres: string[];
}

export type TrackSort = "title" | "artist" | "album" | "createdAt" | "";
export type TrackOrder = "asc" | "desc" | "";

export interface ComponentTrackFilters {
  search: string;
  genre: string;
  artist: string;
  sort: TrackSort;
  order: TrackOrder;
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

export interface SearchParams {
  page?: string;
  search?: string;
  genre?: string;
  artist?: string;
  sort?: string;
  order?: string;
}

export interface ApiError {
  error: string;
  message: string;
}
