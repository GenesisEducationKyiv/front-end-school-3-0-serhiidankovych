import axios, { AxiosError, AxiosResponse } from "axios";
import { ResultAsync } from "neverthrow";
import { z } from "zod";

import { ServerErrorPayload, TrackFilters } from "@/types";

import {
  PaginatedTrackResponseSchema,
  ResponseSchema,
  TrackFormData,
  TrackFormSchema,
  TrackSchema,
} from "./schemas";

const SERVER_BASE_URL = "http://localhost:8000";
const API_BASE_URL = `${SERVER_BASE_URL}/api`;
const STATIC_FILES_PREFIX = "/api/files/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export interface ApiError {
  status: number;
  data: ServerErrorPayload;
}

const handleApiError = (error: AxiosError | Error): ApiError => {
  console.log(error);
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ServerErrorPayload>;
    const status = axiosError.response?.status ?? 500;
    const data = axiosError.response?.data ?? { error: "Unknown error" };

    return { status, data };
  }

  return {
    status: 500,
    data: { error: error.message || "Unknown error" },
  };
};

const makeRequest = <T>(
  requestFn: () => Promise<AxiosResponse>,
  schema: z.ZodSchema<T>
): ResultAsync<T, ApiError> => {
  return ResultAsync.fromPromise(
    requestFn().then((res) => schema.parse(res.data)),
    (error) => handleApiError(error as AxiosError | Error)
  );
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

const validateFormData = (
  data: TrackFormData
): ResultAsync<TrackFormData, ApiError> => {
  const validation = TrackFormSchema.safeParse(data);

  if (!validation.success) {
    const error: ApiError = {
      status: 400,
      data: { error: "Invalid form data" },
    };
    return ResultAsync.fromPromise(
      Promise.reject(error),
      (error) => error as ApiError
    );
  }

  return ResultAsync.fromPromise(Promise.resolve(validation.data), (error) =>
    handleApiError(error as AxiosError | Error)
  );
};

export const api = {
  getTracks(filters: TrackFilters) {
    const query = buildQueryParams(filters);
    return makeRequest(
      () => apiClient.get(`/tracks?${query}`),
      PaginatedTrackResponseSchema
    );
  },

  getTrack(slugOrId: string) {
    return makeRequest(() => apiClient.get(`/tracks/${slugOrId}`), TrackSchema);
  },

  createTrack(data: TrackFormData) {
    return validateFormData(data).andThen(() =>
      makeRequest(() => apiClient.post("/tracks", data), TrackSchema)
    );
  },

  updateTrack(id: string, data: Partial<TrackFormData>) {
    return makeRequest(() => apiClient.put(`/tracks/${id}`, data), TrackSchema);
  },

  deleteTrack(id: string) {
    return makeRequest(() => apiClient.delete(`/tracks/${id}`), ResponseSchema);
  },

  multipleDeleteTracks(ids: string[]) {
    return makeRequest(
      () => apiClient.post("/tracks/delete", { ids }),
      ResponseSchema
    );
  },

  uploadTrackAudio(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return makeRequest(
      () =>
        apiClient.post(`/tracks/${id}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      TrackSchema
    );
  },

  removeTrackAudio(id: string) {
    return makeRequest(
      () => apiClient.delete(`/tracks/${id}/file`),
      TrackSchema
    );
  },

  getArtists() {
    return this.getTracks({ limit: 999, page: 1 }).map((response) => {
      const artists = new Set<string>();

      response.data.forEach((track) => {
        if (track.artist) {
          artists.add(track.artist);
        }
      });

      return Array.from(artists).sort();
    });
  },

  getGenres() {
    return makeRequest(() => apiClient.get("/genres"), z.array(z.string()));
  },

  getTrackAudioUrl(audioFileName: string | null): string | null {
    if (!audioFileName) return null;
    return `${SERVER_BASE_URL}${STATIC_FILES_PREFIX}${encodeURIComponent(
      audioFileName
    )}`;
  },
};
