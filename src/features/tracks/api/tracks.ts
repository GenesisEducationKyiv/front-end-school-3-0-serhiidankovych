import { z } from "zod";

import apiClient from "../lib/base-api-client";
import {
  MultipleDeleteResponse,
  MultipleDeleteResponseSchema,
  PaginatedTrackResponse,
  PaginatedTrackResponseSchema,
  SingleDeleteResponse,
  SingleDeleteResponseSchema,
  Track,
  TrackFormData,
  TrackSchema,
} from "../schemas/schemas";
import { TrackFilters } from "../types";
import { makeRequest } from "./core";
import { buildQueryParams } from "./utils";

export const trackApi = {
  getTracks(filters: TrackFilters): Promise<PaginatedTrackResponse> {
    const query = buildQueryParams(filters);
    return makeRequest(
      () => apiClient.get(`/tracks?${query}`),
      PaginatedTrackResponseSchema
    );
  },

  getTrack(slugOrId: string): Promise<Track> {
    return makeRequest(() => apiClient.get(`/tracks/${slugOrId}`), TrackSchema);
  },

  createTrack(data: TrackFormData): Promise<Track> {
    return makeRequest(() => apiClient.post("/tracks", data), TrackSchema);
  },

  updateTrack(id: string, data: Partial<TrackFormData>): Promise<Track> {
    return makeRequest(() => apiClient.put(`/tracks/${id}`, data), TrackSchema);
  },

  deleteTrack(id: string): Promise<SingleDeleteResponse> {
    return makeRequest(
      () => apiClient.delete(`/tracks/${id}`),
      SingleDeleteResponseSchema
    );
  },

  multipleDeleteTracks(ids: string[]): Promise<MultipleDeleteResponse> {
    return makeRequest(
      () => apiClient.post("/tracks/delete", { ids }),
      MultipleDeleteResponseSchema
    );
  },

  uploadTrackAudio(id: string, file: File): Promise<Track> {
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

  removeTrackAudio(id: string): Promise<Track> {
    return makeRequest(
      () => apiClient.delete(`/tracks/${id}/file`),
      TrackSchema
    );
  },

  getGenres(): Promise<string[]> {
    return makeRequest(() => apiClient.get("/genres"), z.array(z.string()));
  },
};
