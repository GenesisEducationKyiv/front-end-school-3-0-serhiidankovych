import { D } from "@mobily/ts-belt";
import { ArrowDown, ArrowUp, Loader2, Search, Shuffle, X } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGenres } from "../hooks/use-genres";
import { ComponentTrackFilters } from "../types";

interface TrackFiltersProps {
  filters: ComponentTrackFilters;
  updateFilters: (filters: Partial<ComponentTrackFilters>) => void;
}

const isValidSortField = (
  field: string
): field is ComponentTrackFilters["sort"] => {
  return ["title", "artist", "createdAt"].includes(field);
};

const isValidSortOrder = (
  order: string
): order is ComponentTrackFilters["order"] => {
  return ["asc", "desc"].includes(order);
};

const SORT_OPTIONS = [
  { field: "title", direction: "asc", label: "Title (A-Z)" },
  { field: "title", direction: "desc", label: "Title (Z-A)" },
  { field: "artist", direction: "asc", label: "Artist (A-Z)" },
  { field: "artist", direction: "desc", label: "Artist (Z-A)" },
  { field: "createdAt", direction: "desc", label: "Newest First" },
  { field: "createdAt", direction: "asc", label: "Oldest First" },
] as const;

export const TrackFilters = memo(function TrackFilters({
  filters,
  updateFilters,
}: TrackFiltersProps) {
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
      genres.map((item) => (
        <SelectItem key={item} value={item} className="text-xs">
          {item}
        </SelectItem>
      )),
    [genres]
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1 min-w-0 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by title, artist, or album..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="pl-9 h-9 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filters.genre || "all"}
            onValueChange={handleGenreChange}
            disabled={isLoadingGenres || genres.length === 0}
          >
            <SelectTrigger
              aria-label={`Genre: ${filters.genre || "All Genres"}`}
              className="h-9 w-32 bg-background/50 border-border/60 hover:border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SelectValue
                placeholder={
                  isLoadingGenres ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs">Loading...</span>
                    </span>
                  ) : (
                    "All Genres"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
              <SelectItem value="all" className="font-medium text-xs">
                All Genres
              </SelectItem>
              {genres.length > 0 && <SelectSeparator />}
              {genreOptions}
            </SelectContent>
          </Select>

          <Select value={currentSortValue} onValueChange={handleSortChange}>
            <SelectTrigger
              aria-label={`Sorting: ${
                SORT_OPTIONS.find(
                  (opt) =>
                    opt.field === filters.sort &&
                    opt.direction === filters.order
                )?.label || "Default Order"
              }`}
              className="h-9 w-40 bg-background/50 border-border/60 hover:border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            >
              <SelectValue placeholder="Choose sorting" />
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
              <SelectItem value="default" className="font-medium">
                <div className="flex items-center gap-2">
                  <Shuffle className="h-3 w-3" />
                  Default Order
                </div>
              </SelectItem>
              <SelectSeparator />
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={`${option.field}:${option.direction}`}
                  value={`${option.field}:${option.direction}`}
                  className="flex items-center gap-2"
                >
                  {option.direction === "asc" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive bg-muted/50 hover:bg-destructive/10 border border-border/50 rounded-md transition-all duration-200 hover:border-destructive/20"
              data-testid="clear-filters"
              aria-label="Clear filters"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
