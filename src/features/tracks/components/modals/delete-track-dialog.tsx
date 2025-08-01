"use client";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTracksMutation } from "@/features/tracks/hooks/use-delete-tracks";
import { Track } from "@/features/tracks/schemas/schemas";

interface DeleteTrackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tracksToDelete: Track[];
  onSuccess: () => void;
}

export function DeleteTrackDialog({
  isOpen,
  onClose,
  tracksToDelete,
  onSuccess: parentOnSuccess,
}: DeleteTrackDialogProps) {
  const deleteMutation = useDeleteTracksMutation();

  const isDeleting = deleteMutation.isPending;

  const isMultiple = tracksToDelete.length > 1;

  const handleDelete = () => {
    if (tracksToDelete.length === 0) {
      onClose();
      return;
    }

    const ids = tracksToDelete.map((t) => t.id);
    const trackTitles = tracksToDelete.map((t) => t.title);

    deleteMutation.mutate(
      { ids, trackTitles },
      {
        onSuccess: () => {
          parentOnSuccess();
          onClose();
        },
        onError: () => {
          onClose();
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose();
    }
  };

  const dialogTitle = isMultiple
    ? `Delete ${tracksToDelete.length} Tracks?`
    : `Delete Track?`;

  const dialogDescription = isMultiple
    ? `Are you sure you want to delete these ${tracksToDelete.length} tracks? This action cannot be undone.`
    : `Are you sure you want to delete "${tracksToDelete[0]?.title || "this track"}"? This action cannot be undone.`;

  return (
    <AlertDialog
      open={isOpen && tracksToDelete.length > 0}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent data-testid="confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={onClose}
            data-testid="cancel-delete"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
            data-testid="confirm-delete"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : isMultiple ? (
              `Delete ${tracksToDelete.length} Tracks`
            ) : (
              "Delete Track"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
