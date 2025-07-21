"use client";

import { TrackListError } from "@/features/tracks/components/ui/track-list-error";
import { TrackListSkeleton } from "@/features/tracks/components/ui/track-list-skeleton";
import { TrackListTable } from "@/features/tracks/components/ui/track-list-table";
import { Track } from "@/features/tracks/schemas/schemas";

interface TrackListProps {
  tracks: Track[];
  isLoading: boolean;
  onOpen: (trackId: string) => void;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  onUpload: (track: Track) => void;
  onPlay: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  error?: { message: string } | null;
  selectedTrackIds: Set<string>;
  onSelectionChange: (trackId: string, isSelected: boolean) => void;
  onSelectAllChange: (isSelected: boolean) => void;
  isSelectionMode?: boolean;
}

export function TrackList({ isLoading, error, ...props }: TrackListProps) {
  if (isLoading) return <TrackListSkeleton />;
  if (error) return <TrackListError message={error.message} />;

  return <TrackListTable {...props} />;
}
