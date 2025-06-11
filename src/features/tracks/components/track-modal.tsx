import { AlertCircle, Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { R } from "@mobily/ts-belt";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api, ApiError } from "@/features/tracks/api/api";
import { Track, TrackFormData } from "@/features/tracks/schemas/schemas";

import { TrackForm } from "./track-form";

interface TrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  track?: Track | null;
  onSuccess: (track: Track) => void;
  mode: "create" | "edit";
}

export function TrackModal({
  isOpen,
  onClose,
  track,
  onSuccess: parentOnSuccess,
  mode,
}: TrackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = mode === "edit";
  const formId = isEditMode ? "edit-track-form" : "create-track-form";

  const getTrackOperation = (
    data: TrackFormData
  ): Promise<R.Result<Track, ApiError>> | null => {
    if (isEditMode) {
      if (!track?.id) {
        toast.error("Cannot update: Track data or ID is missing.");
        return null;
      }

      const updateAndMap = async () => {
        const result = await api.updateTrack(track.id, data);

        return R.map(result, (updatedTrack) => ({
          ...track,
          ...updatedTrack,
        }));
      };
      return updateAndMap();
    } else {
      return api.createTrack(data);
    }
  };

  const handleSubmit = async (data: TrackFormData) => {
    setIsSubmitting(true);
    setError(null);

    const operation = getTrackOperation(data);
    if (!operation) {
      setIsSubmitting(false);
      return;
    }

    const result = await operation;

    R.match(
      result,
      (processedTrack) => {
        const actionText = isEditMode ? "updated" : "created";
        toast.success(`Track ${actionText}`, {
          description: `"${processedTrack.title}" was ${actionText} successfully.`,
        });
        parentOnSuccess(processedTrack);
        if (!isEditMode) onClose();
      },
      (apiError) => {
        setError(apiError.message || "An unexpected error occurred");
      }
    );

    setIsSubmitting(false);
  };

  const handleInteractOutside = (event: Event) => {
    if (isSubmitting) {
      event.preventDefault();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  if (isEditMode && !track && isOpen) {
    return null;
  }

  const initialData = isEditMode
    ? track
    : {
        title: "",
        artist: "",
        album: "",
        genres: [],
        coverImage: "",
      };

  const icon = isEditMode ? (
    <Pencil className="h-5 w-5 text-muted-foreground" />
  ) : (
    <PlusCircle className="h-5 w-5 text-muted-foreground" />
  );

  const title = isEditMode ? "Edit Track Details" : "Create New Track";
  const description = isEditMode
    ? `Make changes to ${track?.title || "this track"}. Current ID: ${
        track?.id
      }`
    : "Add a new track to your collection";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] flex flex-col"
        onInteractOutside={handleInteractOutside}
        onEscapeKeyDown={handleInteractOutside}
      >
        <DialogHeader className="pr-6">
          <div className="flex items-center space-x-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {icon}
            </span>
            <div>
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-4 flex-shrink-0">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[400px] p-4">
          <TrackForm
            id={formId}
            initialData={initialData as Partial<TrackFormData>}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </ScrollArea>

        <DialogFooter className="pt-4 border-t flex-shrink-0 sm:justify-between">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {isEditMode && track?.updatedAt
              ? `Last updated: ${new Date(track.updatedAt).toLocaleString()}`
              : ""}
          </div>
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting}
              data-testid="submit-button"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Track"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
