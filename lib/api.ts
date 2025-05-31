import axios, { AxiosError } from "axios";
import { ResultAsync } from "neverthrow";
import {
  PaginatedResponse,
  ServerErrorPayload,
  Track,
  TrackFilters,
  TrackFormData,
} from "@/types";

const SERVER_BASE_URL = "http://localhost:8000";
const API_BASE_URL = `${SERVER_BASE_URL}/api`;
const STATIC_FILES_PREFIX = "/api/files/";


export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: ServerErrorPayload
  ) {
    super(message);
    this.name = "ApiError";
  }
}


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});


const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ServerErrorPayload>;
    const status = axiosError.response?.status ?? 500;
    const data = axiosError.response?.data ?? { error: "Unknown error" };
    return new ApiError(data.error, status, data);
  }
  return new ApiError(
    error instanceof Error ? error.message : "Unknown error",
    500,
    { error: "Unknown error" }
  );
};

const makeRequest = <T>(requestFn: () => Promise<{ data: T }>) => {
  return ResultAsync.fromPromise(requestFn().then(res => res.data), handleApiError);
};

const buildQueryParams = (filters: TrackFilters): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && value !== "") {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};


export const api = {
  
  getTracks(filters: TrackFilters) {
    const query = buildQueryParams(filters);
    return makeRequest<PaginatedResponse<Track>>(() => 
      apiClient.get(`/tracks?${query}`)
    );
  },

  getTrack(slugOrId: string) {
    return makeRequest<Track>(() => 
      apiClient.get(`/tracks/${slugOrId}`)
    );
  },

  createTrack(data: TrackFormData) {
    return makeRequest<Track>(() => 
      apiClient.post("/tracks", data)
    );
  },

  updateTrack(id: string, data: Partial<TrackFormData>) {
    return makeRequest<Track>(() => 
      apiClient.put(`/tracks/${id}`, data)
    );
  },

  deleteTrack(id: string) {
    return makeRequest<void>(() => 
      apiClient.delete(`/tracks/${id}`)
    );
  },

  multipleDeleteTracks(ids: string[]) {
    return makeRequest<{ success: string[]; failed: string[] }>(() => 
      apiClient.post("/tracks/delete", { ids })
    );
  },

  
  uploadTrackAudio(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    
    return makeRequest<void>(() =>
      apiClient.post(`/tracks/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  removeTrackAudio(id: string) {
    return makeRequest<Track>(() => 
      apiClient.delete(`/tracks/${id}/file`)
    );
  },

  
  getArtists() {
    return this.getTracks({ limit: 999, page: 1 })
      .map(response => {
        const artists = new Set<string>();
        response.data.forEach(track => {
          if (track.artist) artists.add(track.artist);
        });
        return Array.from(artists).sort();
      });
  },

  getGenres() {
    return makeRequest<string[]>(() => 
      apiClient.get("/genres")
    );
  },

  
  getTrackAudioUrl(audioFileName: string | null) {
    return audioFileName
      ? `${SERVER_BASE_URL}${STATIC_FILES_PREFIX}${encodeURIComponent(audioFileName)}`
      : null;
  },
};