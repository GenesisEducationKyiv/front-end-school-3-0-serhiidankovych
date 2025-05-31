import axios, { AxiosError } from "axios";
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

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: ServerErrorPayload
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ServerErrorPayload>) => {
    const status = error.response?.status ?? 500;
    const data = error.response?.data ?? { error: "Unknown error" };
    throw new ApiError(data.error, status, data);
  }
);

function buildQueryParams(filters: TrackFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && value !== "") {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

export const api = {
  async getTracks(filters: TrackFilters): Promise<PaginatedResponse<Track>> {
    const query = buildQueryParams(filters);
    const response = await apiClient.get(`/tracks?${query}`);
    return response.data;
  },

  async getTrack(slugOrId: string): Promise<Track> {
    const response = await apiClient.get(`/tracks/${slugOrId}`);
    return response.data;
  },

  async createTrack(data: TrackFormData): Promise<Track> {
    const response = await apiClient.post("/tracks", data);
    return response.data;
  },

  async updateTrack(id: string, data: Partial<TrackFormData>): Promise<Track> {
    const response = await apiClient.put(`/tracks/${id}`, data);
    return response.data;
  },

  async deleteTrack(id: string): Promise<void> {
    await apiClient.delete(`/tracks/${id}`);
  },

  async multipleDeleteTracks(
    ids: string[]
  ): Promise<{ success: string[]; failed: string[] }> {
    const response = await apiClient.post("/tracks/delete", { ids });
    return response.data;
  },

  async uploadTrackAudio(id: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    await apiClient.post(`/tracks/${id}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async removeTrackAudio(id: string): Promise<Track> {
    const response = await apiClient.delete(`/tracks/${id}/file`);
    return response.data;
  },

  async getArtists(): Promise<string[]> {
    const { data } = await this.getTracks({ limit: 999, page: 1 });
    const artists = Array.from(
      new Set(data.map((t) => t.artist).filter((a): a is string => Boolean(a)))
    );
    return artists.sort();
  },

  async getGenres(): Promise<string[]> {
    const response = await apiClient.get("/genres");
    return response.data;
  },

  getTrackAudioUrl(audioFileName: string | null): string | null {
    return audioFileName
      ? `${SERVER_BASE_URL}${STATIC_FILES_PREFIX}${encodeURIComponent(audioFileName)}`
      : null;
  },
};
