"use client";

import { useCallback, useEffect, useState } from "react";
import { R } from "@mobily/ts-belt";

import { useDebounce } from "@/hooks/use-debounce";
import { api, ApiError } from "../api/api";
import { PaginatedTrackResponse, Track } from "../schemas/schemas";
import { ComponentTrackFilters } from "../types";

export const ITEMS_PER_PAGE = 10;

type TracksState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      data: PaginatedTrackResponse;
      isRefreshing: boolean;
    }
  | {
      status: "error";
      error: ApiError;
      isRefreshing: boolean;
    };

export function useTracks() {
  const [tracksState, setTracksState] = useState<TracksState>({
    status: "idle",
  });
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ComponentTrackFilters>({
    search: "",
    genre: "",
    artist: "",
    sort: "",
    order: "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const updateFilters = useCallback(
    (newFilters: Partial<ComponentTrackFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1);
    },
    []
  );

  const fetchTracks = useCallback(async () => {
    if (tracksState.status === "success") {
      setTracksState({ ...tracksState, isRefreshing: true });
    } else {
      setTracksState({ status: "loading" });
    }

    const apiFilters = {
      ...filters,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch,
    };

    const result = await api.getTracks(apiFilters);

    R.match(
      result,
      (data) =>
        setTracksState({ status: "success", data, isRefreshing: false }),
      (error) => setTracksState({ status: "error", error, isRefreshing: false })
    );
  }, [currentPage, debouncedSearch, filters, tracksState.status]);

  useEffect(() => {
    if (tracksState.status === "idle") {
      fetchTracks();
    }
  }, []);

  useEffect(() => {
    if (tracksState.status !== "idle") {
      fetchTracks();
    }
  }, [currentPage, debouncedSearch, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTrackOperation = async <T extends {}>(
    operation: () => Promise<R.Result<T, ApiError>>
  ): Promise<R.Result<T, ApiError>> => {
    const result = await operation();

    if (R.isOk(result)) {
      fetchTracks();
    } else {
      console.error("Track operation failed:", result);
    }

    return result;
  };

  const tracks = tracksState.status === "success" ? tracksState.data.data : [];
  const totalTracks =
    tracksState.status === "success" ? tracksState.data.meta.total : 0;

  const isLoading = tracksState.status === "loading";
  const isRefreshing =
    (tracksState.status === "success" || tracksState.status === "error") &&
    tracksState.isRefreshing;

  const error = tracksState.status === "error" ? tracksState.error : null;

  return {
    tracks,
    totalTracks,
    isLoading,
    isRefreshing,
    error,
    currentTrack,
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
