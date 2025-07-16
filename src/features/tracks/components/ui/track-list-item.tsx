"use client";

import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { TrackActionsMenu } from "@/features/tracks/components/ui/track-actions-menu";
import { TrackCoverImage } from "@/features/tracks/components/ui/track-cover-image";
import { TrackPlayButton } from "@/features/tracks/components/ui/track-play-button";
import { Track } from "@/features/tracks/schemas/schemas";

interface TrackListItemProps {
  track: Track;
  onOpen: (trackId: string) => void;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  onUpload: (track: Track) => void;
  onPlay: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  isSelected: boolean;
  onSelectionChange: (trackId: string, isSelected: boolean) => void;
  isSelectionMode?: boolean;
}

export function TrackListItem({
  track,
  onOpen,
  onEdit,
  onDelete,
  onUpload,
  onPlay,
  currentTrackId,
  isPlaying,
  isSelected,
  onSelectionChange,
  isSelectionMode,
}: TrackListItemProps) {
  const router = useRouter();
  const isCurrentTrack = currentTrackId === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;
  const hasAudio = Boolean(track.audioFile);

  return (
    <TableRow
      key={track.id}
      data-testid={`track-item-${track.id}`}
      className={`${isCurrentTrack ? "bg-accent" : ""} ${
        isSelected ? "bg-blue-100 dark:bg-blue-900/30" : ""
      }`}
      data-state={isSelected ? "selected" : undefined}
    >
      <TableCell className="pl-4">
        {isSelectionMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) =>
              onSelectionChange(track.id, Boolean(checked))
            }
            aria-label={`Select row for ${track.title}`}
          />
        )}
      </TableCell>
      <TableCell>
        <div className="relative h-10 w-10">
          <TrackCoverImage track={track} />
          {hasAudio && (
            <TrackPlayButton
              track={track}
              isCurrentlyPlaying={isCurrentlyPlaying}
              onPlay={onPlay}
            />
          )}
        </div>
      </TableCell>
      <TableCell
        className="font-medium cursor-pointer"
        onClick={() => router.push(`/tracks/${track.id}`)}
      >
        {track.title}
      </TableCell>
      <TableCell>{track.artist}</TableCell>
      <TableCell className="hidden md:table-cell">{track.album}</TableCell>
      <TableCell className="hidden sm:table-cell">
        {track.genres?.join(", ")}
      </TableCell>
      <TableCell className="text-right">
        <TrackActionsMenu
          track={track}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpload={onUpload}
          onPlay={onPlay}
          isCurrentlyPlaying={isCurrentlyPlaying}
          hasAudio={hasAudio}
        />
      </TableCell>
    </TableRow>
  );
}
