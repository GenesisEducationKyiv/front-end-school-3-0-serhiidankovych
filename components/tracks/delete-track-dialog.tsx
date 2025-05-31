import { useState } from "react";
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
import { toast } from "sonner";
import { Track } from "@/types";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

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

    try {
      const result = isMultiple
        ? await api.multipleDeleteTracks(trackIdsToDelete)
        : await api.deleteTrack(trackIdsToDelete[0]);

      if (result.isOk()) {
        const data = result.value;

        if (isMultiple) {
          const multipleDeleteData = data as {
            success: string[];
            failed: string[];
          };
          if (multipleDeleteData.failed?.length > 0) {
            toast.warning(
              `${multipleDeleteData.success.length} tracks deleted, ${multipleDeleteData.failed.length} failed.`,
              {
                description: `Failed IDs: ${multipleDeleteData.failed.join(
                  ", "
                )}`,
              }
            );
          } else {
            toast.success(`${trackIdsToDelete.length} Tracks deleted`, {
              description: `The selected tracks have been deleted successfully.`,
            });
          }
        } else {
          const singleTrackTitle = tracksToDelete[0]?.title || "this track";
          toast.success("Track deleted", {
            description: `"${singleTrackTitle}" has been deleted successfully.`,
          });
        }

        parentOnSuccess();
      } else {
        const err = result.error;
        console.error(`Failed to delete track(s)`, err);
        toast.error("Delete failed", {
          description: err.message || "An unknown error occurred",
        });
      }
    } finally {
      setIsDeleting(false);
      onClose();
    }
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
