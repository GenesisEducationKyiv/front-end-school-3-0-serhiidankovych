import { D } from "@mobily/ts-belt";
import { useCallback, useMemo } from "react";

import { useGenres } from "../hooks/use-genres";
import { ComponentTrackFilters } from "../types";

const SORT_OPTIONS = [
  { field: "title", direction: "asc", label: "Title (A-Z)" },
  { field: "title", direction: "desc", label: "Title (Z-A)" },
  { field: "artist", direction: "asc", label: "Artist (A-Z)" },
  { field: "artist", direction: "desc", label: "Artist (Z-A)" },
  { field: "createdAt", direction: "desc", label: "Newest First" },
  { field: "createdAt", direction: "asc", label: "Oldest First" },
] as const;

const isValidSortField = (
  field: string
): field is ComponentTrackFilters["sort"] =>
  ["title", "artist", "createdAt"].includes(field);

const isValidSortOrder = (
  order: string
): order is ComponentTrackFilters["order"] => ["asc", "desc"].includes(order);

export function useTrackFilters(
  filters: ComponentTrackFilters,
  updateFilters: (filters: Partial<ComponentTrackFilters>) => void
) {
  const { data: genres = [], isLoading: isLoadingGenres } = useGenres();

  const hasActiveFilters = useMemo(
    () => D.values(filters).some((v) => v !== undefined && v !== ""),
    [filters]
  );

  const currentSortValue = useMemo((): string => {
    return filters.sort && filters.order
      ? `${filters.sort}:${filters.order}`
      : "default";
  }, [filters.sort, filters.order]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilters({ search: e.target.value || undefined });
    },
    [updateFilters]
  );

  const handleGenreChange = useCallback(
    (value: string) => {
      updateFilters({ genre: value === "all" ? undefined : value });
    },
    [updateFilters]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      if (value === "default") {
        updateFilters({ sort: undefined, order: undefined });
      } else {
        const [field, direction] = value.split(":");
        if (
          field &&
          direction &&
          isValidSortField(field) &&
          isValidSortOrder(direction)
        ) {
          updateFilters({ sort: field, order: direction });
        } else {
          updateFilters({ sort: undefined, order: undefined });
        }
      }
    },
    [updateFilters]
  );

  const handleClearFilters = useCallback(() => {
    updateFilters({
      search: undefined,
      genre: undefined,
      artist: undefined,
      sort: undefined,
      order: undefined,
    });
  }, [updateFilters]);

  const genreOptions = useMemo(
    () =>
      genres.map((item) => ({
        label: item,
        value: item,
      })),
    [genres]
  );

  return {
    isLoadingGenres,
    genres,
    hasActiveFilters,
    currentSortValue,
    handleSearchChange,
    handleGenreChange,
    handleSortChange,
    handleClearFilters,
    genreOptions,
    SORT_OPTIONS,
  };
}
