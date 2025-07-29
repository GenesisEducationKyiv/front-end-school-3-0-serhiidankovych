"use client";
import { CopyX, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TracksPageHeaderProps {
  isSelectionMode: boolean;
  selectedTrackIds: Set<string>;
  onToggleSelectionMode: () => void;
  onMultipleDelete: () => void;
  onAddTrack: () => void;
}

export function TracksPageHeader({
  isSelectionMode,
  selectedTrackIds,
  onToggleSelectionMode,
  onMultipleDelete,
  onAddTrack,
}: TracksPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-3xl font-bold" data-testid="tracks-header">
        Tracks
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant={isSelectionMode ? "secondary" : "outline"}
          onClick={onToggleSelectionMode}
          size="sm"
        >
          <CopyX className="mr-2 h-4 w-4" />
          {isSelectionMode ? "Exit Selection" : "Select Tracks"}
        </Button>
        {selectedTrackIds.size > 0 && (
          <Button variant="destructive" onClick={onMultipleDelete} size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedTrackIds.size})
          </Button>
        )}
        <Button
          onClick={onAddTrack}
          data-testid="create-track-button"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Track
        </Button>
      </div>
    </div>
  );
}
