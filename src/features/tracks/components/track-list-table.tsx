"use client";

import { useMemo } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrackListItem } from "@/features/tracks/components/ui/track-list-item";
import { Track } from "@/features/tracks/schemas/schemas";

interface TrackListTableProps {
  tracks: Track[];
  onOpen: (trackId: string) => void;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  onUpload: (track: Track) => void;
  onPlay: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  selectedTrackIds: Set<string>;
  onSelectionChange: (trackId: string, isSelected: boolean) => void;
  onSelectAllChange: (isSelected: boolean) => void;
  isSelectionMode?: boolean;
}

export function TrackListTable({
  tracks,
  selectedTrackIds,
  onSelectAllChange,
  isSelectionMode,
  ...props
}: TrackListTableProps) {
  const numSelected = selectedTrackIds.size;
  const numVisible = tracks.length;
  const allVisibleSelected = numVisible > 0 && numSelected === numVisible;

  const headerCheckboxState = useMemo(() => {
    if (allVisibleSelected) return true;
    if (numSelected > 0 && !allVisibleSelected) return "indeterminate";
    return false;
  }, [allVisibleSelected, numSelected]);

  return (
    <div className="rounded-md border" data-testid="track-list-data">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] pl-4">
              {isSelectionMode && tracks.length > 0 && (
                <Checkbox
                  checked={headerCheckboxState}
                  onCheckedChange={(checked) =>
                    onSelectAllChange(Boolean(checked))
                  }
                  aria-label="Select all rows"
                />
              )}
            </TableHead>
            <TableHead className="w-[60px]" />
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="hidden md:table-cell">Album</TableHead>
            <TableHead className="hidden sm:table-cell">Genres</TableHead>
            <TableHead className="text-right w-[80px] pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track) => (
            <TrackListItem
              key={track.id}
              track={track}
              isSelected={selectedTrackIds.has(track.id)}
              {...props}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
