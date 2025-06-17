import { R, O, A, D, G, pipe } from "@mobily/ts-belt";
import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";

import {
  MultipleDeleteResponseSchema,
  PaginatedTrackResponseSchema,
  SingleDeleteResponseSchema,
  TrackFormData,
  TrackFormSchema,
  TrackSchema,
} from "../schemas/schemas";
import { TrackFilters } from "../types";

const SERVER_BASE_URL = "http://localhost:8000";
const API_BASE_URL = `${SERVER_BASE_URL}/api`;
const STATIC_FILES_PREFIX = "/api/files/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

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

const makeRequest = <T extends {}>(
  requestFn: () => Promise<AxiosResponse>,
  schema: z.ZodSchema<T>
): Promise<R.Result<T, ApiError>> => {
  return requestFn().then(
    (response) => {
      const validation = schema.safeParse(response.data);
      if (validation.success) {
        return R.Ok(validation.data);
      }

      return R.Error({
        error: "Validation Error",
        message: validation.error.errors.map((e) => e.message).join(", "),
      });
    },

    (error) => {
      return R.Error(handleApiError(error as AxiosError));
    }
  );
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

const validateFormData = (
  data: TrackFormData
): R.Result<TrackFormData, ApiError> => {
  const validation = TrackFormSchema.safeParse(data);
  if (validation.success) {
    return R.Ok(validation.data);
  }
  return R.Error({
    error: "Invalid Form Data",
    message: validation.error.errors.map((e) => e.message).join(", "),
  });
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

  async createTrack(
    data: TrackFormData
  ): Promise<R.Result<z.infer<typeof TrackSchema>, ApiError>> {
    const validationResult = validateFormData(data);
    const validatedData = R.getExn(validationResult);

    if (R.isError(validationResult)) {
      return validationResult;
    }

    return makeRequest(
      () => apiClient.post("/tracks", validatedData),
      TrackSchema
    );
  },

  updateTrack(id: string, data: Partial<TrackFormData>) {
    return makeRequest(() => apiClient.put(`/tracks/${id}`, data), TrackSchema);
  },

  deleteTrack(id: string) {
    return makeRequest(
      () => apiClient.delete(`/tracks/${id}`),
      SingleDeleteResponseSchema
    );
  },

  multipleDeleteTracks(ids: string[]) {
    return makeRequest(
      () => apiClient.post("/tracks/delete", { ids }),
      MultipleDeleteResponseSchema
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

  async getArtists(): Promise<R.Result<string[], ApiError>> {
    const result = await this.getTracks({
      limit: 999,
      page: 1,
      search: "",
      genre: "",
      artist: "",
      sort: "",
      order: "",
    });

    return pipe(
      result,
      R.map((response) => {
        const artists = new Set<string>();
        response.data.forEach((track) => {
          if (track.artist) {
            artists.add(track.artist);
          }
        });
        return Array.from(artists).sort();
      })
    );
  },

  getGenres() {
    return makeRequest(() => apiClient.get("/genres"), z.array(z.string()));
  },

  getTrackAudioUrl(audioFileName: string | null): O.Option<string> {
    return pipe(
      O.fromNullable(audioFileName),
      O.map(
        (fileName) =>
          `${SERVER_BASE_URL}${STATIC_FILES_PREFIX}${encodeURIComponent(
            fileName
          )}`
      )
    );
  },
};
