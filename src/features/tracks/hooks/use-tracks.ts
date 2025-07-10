"use client";

import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/use-debounce";

import { api, ApiError } from "../api/api";
import { PaginatedTrackResponse } from "../schemas/schemas";
import { ComponentTrackFilters } from "../types";

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
