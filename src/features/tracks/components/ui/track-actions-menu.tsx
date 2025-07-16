"use client";

import {
  Edit,
  MoreHorizontal,
  Music,
  Pause,
  Play,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Track } from "@/features/tracks/schemas/schemas";

interface TrackActionsMenuProps {
  track: Track;
  onOpen: (trackId: string) => void;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  onUpload: (track: Track) => void;
  onPlay: (track: Track) => void;
  isCurrentlyPlaying: boolean;
  hasAudio: boolean;
}

export function TrackActionsMenu({
  track,
  onOpen,
  onEdit,
  onDelete,
  onUpload,
  onPlay,
  isCurrentlyPlaying,
  hasAudio,
}: TrackActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          data-testid={`actions-trigger-${track.id}`}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onOpen(track.id)}
          data-testid={`open-track-${track.id}`}
        >
          <Music className="mr-2 h-4 w-4" />
          <span>Open Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onEdit(track)}
          data-testid={`edit-track-${track.id}`}
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpload(track)}
          data-testid={`upload-track-${track.id}`}
        >
          <Upload className="mr-2 h-4 w-4" />
          <span>{hasAudio ? "Update Audio" : "Upload Audio"}</span>
        </DropdownMenuItem>
        {hasAudio && (
          <DropdownMenuItem
            onClick={() => onPlay(track)}
            data-testid={`play-track-${track.id}`}
          >
            {isCurrentlyPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                <span>Pause Track</span>
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                <span>Play Track</span>
              </>
            )}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(track)}
          className="text-red-600 focus:text-red-600"
          data-testid={`delete-track-${track.id}`}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Track</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
