"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { D, R } from "@mobily/ts-belt";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentTrackFilters } from "../types";
import { api, ApiError } from "../api/api";

interface TrackFiltersProps {
  filters: ComponentTrackFilters;
  updateFilters: (filters: Partial<ComponentTrackFilters>) => void;
}

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

      genresResult.match(
        (data) => setGenres(R.Ok(data)),
        (err: ApiError) => setGenres(R.Error(new Error(err.message)))
      );

      artistsResult.match(
        (data) => setArtists(R.Ok(data)),
        (err: ApiError) => setArtists(R.Error(new Error(err.message)))
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
  ];

  const handleSortChange = (value: string) => {
    if (value === "default") {
      updateFilters({ sort: undefined, order: undefined });
    } else {
      const [field, direction] = value.split(":");
      updateFilters({
        sort: field as ComponentTrackFilters["sort"],
        order: direction as ComponentTrackFilters["order"],
      });
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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:flex-wrap">
      <div className="relative flex-grow md:flex-grow-0 md:min-w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tracks..."
          value={filters.search || ""}
          onChange={(e) =>
            updateFilters({ search: e.target.value || undefined })
          }
          className="pl-9 w-full"
        />
      </div>

      <div className="min-w-[150px]">
        <Select
          value={filters.genre || "all"}
          onValueChange={(value) =>
            updateFilters({ genre: value === "all" ? undefined : value })
          }
          disabled={isSelectDisabled(genres)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={isLoading ? "Loading..." : "Filter by genre"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {renderSelectItems(genres, "genres")}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[150px]">
        <Select
          value={filters.artist || "all"}
          onValueChange={(value) =>
            updateFilters({ artist: value === "all" ? undefined : value })
          }
          disabled={isSelectDisabled(artists)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={isLoading ? "Loading..." : "Filter by artist"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Artists</SelectItem>
            {renderSelectItems(artists, "artists")}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Sorting</SelectItem>
            {sortOptions.map((option) => (
              <SelectItem
                key={`${option.field}:${option.direction}`}
                value={`${option.field}:${option.direction}`}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="text-sm text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
          data-testid="clear-filters"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
