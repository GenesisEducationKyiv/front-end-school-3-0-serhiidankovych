"use client";
import { Loader2 } from "lucide-react";

import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ITEMS_PER_PAGE } from "@/features/tracks/hooks/use-tracks";

interface TracksStatusBarProps {
  isLoading: boolean;
  isFetching: boolean;
  totalTracks: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TracksStatusBar({
  isLoading,
  isFetching,
  totalTracks,
  currentPage,
  totalPages,
  onPageChange,
}: TracksStatusBarProps) {
  if (isLoading) {
    return (
      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-5 w-[250px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-h-5 items-center text-sm text-muted-foreground">
        {isFetching ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            <span>Updating results...</span>
          </span>
        ) : (
          <span>
            {totalTracks === 0
              ? "No tracks found"
              : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalTracks)}-${Math.min(currentPage * ITEMS_PER_PAGE, totalTracks)} of ${totalTracks} track${totalTracks !== 1 ? "s" : ""}`}
          </span>
        )}
      </div>
      {totalTracks > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
