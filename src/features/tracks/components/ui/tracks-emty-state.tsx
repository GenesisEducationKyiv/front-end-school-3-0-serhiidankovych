"use client";
import { ComponentTrackFilters } from "@/features/tracks/types";

interface TracksEmptyStateProps {
  filters: ComponentTrackFilters;
}

export function TracksEmptyState({ filters }: TracksEmptyStateProps) {
  return (
    <div className="rounded-md border bg-muted/50 py-12 text-center">
      <p className="mb-2 text-lg font-medium">No Tracks Found</p>
      <p className="text-sm text-muted-foreground">
        {Object.values(filters).some(Boolean)
          ? "Try adjusting your filters to see more results."
          : "Add your first track to get started."}
      </p>
    </div>
  );
}
