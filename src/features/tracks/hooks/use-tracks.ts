import { ResultAsync } from "neverthrow";
import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { api, ApiError } from "../api/api";
import { Track } from "../schemas/schemas";
import { ComponentTrackFilters } from "../types";

export const ITEMS_PER_PAGE = 10;

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [totalTracks, setTotalTracks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ComponentTrackFilters>({
    search: "",
    genre: "",
    artist: "",
    sort: "title",
    order: "asc",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const updateFilters = useCallback(
    (newFilters: Partial<ComponentTrackFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      if (
        Object.keys(newFilters).some(
          (key) => key !== "search" || newFilters.search === ""
        )
      ) {
        setCurrentPage(1);
      }
      if (Object.keys(newFilters).length > 0) {
        setIsRefreshing(true);
      }
    },
    []
  );

  const fetchTracks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const apiFilters = {
      ...filters,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch || "",
    };

    const result = await api.getTracks(apiFilters);

    if (result.isOk()) {
      const response = result.value;
      if (response?.data && Array.isArray(response.data)) {
        setTracks(response.data);
        setTotalTracks(response.meta.total);
      } else {
        setError("Invalid response structure");
        setTracks([]);
        setTotalTracks(0);
      }
    } else {
      const apiError = result.error;
      setError(apiError.error || "Failed to fetch tracks");
      setTracks([]);
      setTotalTracks(0);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, [currentPage, debouncedSearch, filters]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    setError(null);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTrackOperation = async <T>(
    operation: () => ResultAsync<T, ApiError>,
    onSuccess?: (data: T) => void,
    onError?: (error: ApiError) => void
  ) => {
    const result = await operation();

    if (result.isOk()) {
      onSuccess?.(result.value);
    } else {
      const apiError = result.error;
      setError(apiError.error || "An unexpected error occurred");
      onError?.(apiError);
    }
  };

  return {
    tracks,
    isLoading,
    isRefreshing,
    error,
    currentTrack,
    totalTracks,
    currentPage,
    filters,
    ITEMS_PER_PAGE,
    fetchTracks,
    handlePageChange,
    updateFilters,
    setCurrentTrack,
    handleTrackOperation,
  };
}
