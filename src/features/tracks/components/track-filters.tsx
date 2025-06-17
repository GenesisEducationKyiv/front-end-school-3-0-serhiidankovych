"use client";
import { ArrowDown, ArrowUp, Loader2, Search, Shuffle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { D, R } from "@mobily/ts-belt";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentTrackFilters } from "../types";
import { api } from "../api/api";

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

export function TrackFilters({ filters, updateFilters }: TrackFiltersProps) {
  const [genres, setGenres] = useState<R.Result<string[], Error>>(R.Ok([]));
  const [artists, setArtists] = useState<R.Result<string[], Error>>(R.Ok([]));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true);
      const [genresResult, artistsResult] = await Promise.all([
        api.getGenres(),
        api.getArtists(),
      ]);
      setGenres(R.mapError(genresResult, (error) => new Error(error.message)));
      setArtists(
        R.mapError(artistsResult, (error) => new Error(error.message))
      );
      setIsLoading(false);
    };
    fetchFilterOptions();
  }, []);

  const sortOptions = [
    { field: "title", direction: "asc", label: "Title (A-Z)" },
    { field: "title", direction: "desc", label: "Title (Z-A)" },
    { field: "artist", direction: "asc", label: "Artist (A-Z)" },
    { field: "artist", direction: "desc", label: "Artist (Z-A)" },
    { field: "createdAt", direction: "desc", label: "Newest First" },
    { field: "createdAt", direction: "asc", label: "Oldest First" },
  ] as const;

  const handleSortChange = (value: string) => {
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
        updateFilters({
          sort: field,
          order: direction,
        });
      } else {
        updateFilters({ sort: undefined, order: undefined });
      }
    }
  };

  const getCurrentSortValue = (): string => {
    if (filters.sort && filters.order) {
      return `${filters.sort}:${filters.order}`;
    }
    return "default";
  };

  const handleClearFilters = () => {
    updateFilters({
      search: undefined,
      genre: undefined,
      artist: undefined,
      sort: undefined,
      order: undefined,
    });
  };

  const hasActiveFilters = D.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  const renderSelectItems = (data: R.Result<string[], Error>, noun: string) =>
    R.match(
      data,
      (items) =>
        items.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        )),
      (error) => [
        <SelectItem key="error" value="error" disabled>
          Failed to load {noun}
        </SelectItem>,
      ]
    );

  const isSelectDisabled = (data: R.Result<string[], Error>): boolean => {
    if (isLoading) return true;
    return R.getWithDefault(
      R.map(data, (items) => items.length === 0),
      true
    );
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1 min-w-0 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by title, artist, or album..."
              value={filters.search || ""}
              onChange={(e) =>
                updateFilters({ search: e.target.value || undefined })
              }
              className="pl-9 h-9 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={filters.genre || "all"}
              onValueChange={(value) =>
                updateFilters({ genre: value === "all" ? undefined : value })
              }
              disabled={isSelectDisabled(genres)}
            >
              <SelectTrigger className="h-9 w-32 bg-background/50 border-border/60 hover:border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue
                  placeholder={
                    isLoading ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs">Loading...</span>
                      </span>
                    ) : (
                      <span className="text-xs">All</span>
                    )
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
                <SelectItem value="all" className="font-medium text-xs">
                  All Genres
                </SelectItem>
                <SelectSeparator />
                {renderSelectItems(genres, "genres")}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filters.artist || "all"}
              onValueChange={(value) =>
                updateFilters({ artist: value === "all" ? undefined : value })
              }
              disabled={isSelectDisabled(artists)}
            >
              <SelectTrigger className="h-9 w-32 bg-background/50 border-border/60 hover:border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue
                  placeholder={
                    isLoading ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs">Loading...</span>
                      </span>
                    ) : (
                      <span className="text-xs">All</span>
                    )
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
                <SelectItem value="all" className="font-medium text-xs">
                  All Artists
                </SelectItem>
                <SelectSeparator />
                {renderSelectItems(artists, "artists")}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={getCurrentSortValue()}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="h-9 w-40 bg-background/50 border-border/60 hover:border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200">
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
                {sortOptions.map((option) => (
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
          </div>

          {hasActiveFilters && (
            <>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive bg-muted/50 hover:bg-destructive/10 border border-border/50 rounded-md transition-all duration-200 hover:border-destructive/20"
                data-testid="clear-filters"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
