import { A, D, G, O, pipe } from "@mobily/ts-belt";
import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import { Sink } from "graphql-ws";
import {
  MultipleDeleteResponseSchema,
  PaginatedTrackResponseSchema,
  SingleDeleteResponseSchema,
  TrackFormData,
  TrackSchema,
  PaginatedTrackResponse,
  Track,
  MultipleDeleteResponse,
  SingleDeleteResponse,
} from "../schemas/schemas";
import { TrackFilters } from "../types";

import apiClient from "../lib/base-api-client";
import graphqlClient from "../lib/graphql-client";

const FILES_URL = process.env.NEXT_PUBLIC_FILES_URL!;

export interface ApiError {
  error: string;
  message: string;
}
interface ErrorResponse {
  error?: string;
  message?: string;
}

const handleApiError = (error: AxiosError): ApiError => {
  const responseData = error.response?.data as ErrorResponse;
  return {
    error: responseData?.error || "Unknown error",
    message: responseData?.message || error.message || "Something went wrong",
  };
};

const makeRequest = async <T>(
  requestFn: () => Promise<AxiosResponse>,
  schema: z.ZodSchema<T>
): Promise<T> => {
  try {
    const response = await requestFn();
    const validation = schema.safeParse(response.data);

    if (validation.success) {
      return validation.data;
    } else {
      const validationErrorMessage = validation.error.errors
        .map((e) => e.message)
        .join(", ");
      throw new Error(
        `API response validation failed: ${validationErrorMessage}`
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw handleApiError(error);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

const buildQueryParams = (filters: TrackFilters): string => {
  const params = new URLSearchParams();
  pipe(
    D.toPairs(filters),
    A.forEach(([key, value]) => {
      if (!G.isNullable(value) && value !== "") {
        params.append(key, String(value));
      }
    })
  );
  return params.toString();
};

export const api = {
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

  async getArtists(): Promise<string[]> {
    const response = await this.getTracks({
      limit: 999,
      page: 1,
      search: "",
      genre: "",
      artist: "",
      sort: "",
      order: "",
    });

    const artists = new Set<string>();
    response.data.forEach((track) => {
      if (track.artist) {
        artists.add(track.artist);
      }
    });
    return Array.from(artists).sort();
  },

  getGenres(): Promise<string[]> {
    return makeRequest(() => apiClient.get("/genres"), z.array(z.string()));
  },

  getTrackAudioUrl(audioFileName: string | null): O.Option<string> {
    return pipe(
      O.fromNullable(audioFileName),
      O.map((fileName) => `${FILES_URL}${encodeURIComponent(fileName)}`)
    );
  },

  subscribeToActiveTrack(
    onData: (trackName: string | null) => void
  ): () => void {
    const sink: Sink<{
      data: {
        activeTrackChanged: string | null;
      };
      activeTrackChanged: string | null;
    }> = {
      next: (result) => {
        const trackName = result.data?.activeTrackChanged ?? null;
        onData(trackName);
      },
      error: (err) => {
        console.error("Subscription error.");
      },
      complete: () => {
        console.log("Subscription completed.");
      },
    };
    const unsubscribe = graphqlClient.subscribe(
      {
        query: "subscription { activeTrackChanged }",
      },
      sink
    );
    return unsubscribe;
  },
};
