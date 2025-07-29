"use client";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/features/tracks/api";
import { PaginatedTrackResponse } from "@/features/tracks/schemas/schemas";
import { ApiError, ComponentTrackFilters } from "@/features/tracks/types";
import { useDebounce } from "@/hooks/use-debounce";

export const ITEMS_PER_PAGE = 10;

interface UseTracksQueryProps {
  filters: ComponentTrackFilters;
  currentPage: number;
}

export function useTracksQuery({ filters, currentPage }: UseTracksQueryProps) {
  const debouncedSearch = useDebounce(filters.search, 500);

  const queryParams = {
    ...filters,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  };

  return useQuery<PaginatedTrackResponse, ApiError>({
    queryKey: ["tracks", queryParams],
    queryFn: () => api.getTracks(queryParams),
  });
}
