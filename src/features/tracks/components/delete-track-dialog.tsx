import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

import { api } from "../api/api";
import { Track } from "../schemas/schemas";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const isMultiple = tracksToDelete.length > 1;
  const trackIdsToDelete = tracksToDelete.map((t) => t.id);

  const handleDelete = async () => {
    if (trackIdsToDelete.length === 0) {
      onClose();
      return;
    }

    setIsDeleting(true);

    if (isMultiple) {
      const result = await api.multipleDeleteTracks(trackIdsToDelete);

      if (result.isOk()) {
        const data = result.value as { success: string[]; failed: string[] };

        if (data.failed?.length > 0) {
          toast.warning(
            `${data.success.length} tracks deleted, ${data.failed.length} failed.`,
            {
              description: `Failed IDs: ${data.failed.join(", ")}`,
            }
          );
        } else {
          toast.success(`${trackIdsToDelete.length} Tracks deleted`);
        }
        parentOnSuccess();
      } else {
        const apiError = result.error;

        toast.error("Delete failed", {
          description: apiError.error || "An unexpected error occurred",
        });
      }
    } else {
      const result = await api.deleteTrack(trackIdsToDelete[0]);

      if (result.isOk()) {
        const singleTrackTitle = tracksToDelete[0]?.title || "this track";
        toast.success("Track deleted", {
          description: `"${singleTrackTitle}" has been deleted successfully.`,
        });
        parentOnSuccess();
      } else {
        const apiError = result.error;
        toast.error("Delete failed", {
          description: apiError.error || "An unexpected error occurred",
        });
      }
    }

    setIsDeleting(false);
    onClose();
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
    : `Are you sure you want to delete "${
        tracksToDelete[0]?.title || "this track"
      }"? This action cannot be undone.`;

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
