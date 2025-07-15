"use client";
import { AlertCircle, Loader2, Pencil, PlusCircle } from "lucide-react";

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
import { Track, TrackFormData } from "@/features/tracks/schemas/schemas";

import { useSaveTrack } from "../../hooks/use-save-track";
import { TrackForm } from "../ui/track-form";

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
  const saveTrackMutation = useSaveTrack();

  const isSubmitting = saveTrackMutation.isPending;
  const error = saveTrackMutation.error?.message;
  const isEditMode = mode === "edit";
  const formId = isEditMode ? "edit-track-form" : "create-track-form";

  const handleSubmit = (data: TrackFormData) => {
    saveTrackMutation.mutate(
      {
        data,
        id: isEditMode ? track?.id : undefined,
      },
      {
        onSuccess: (processedTrack) => {
          parentOnSuccess(processedTrack);

          if (!isEditMode) {
            onClose();
          }
        },
      }
    );
  };

  const handleInteractOutside = (event: Event) => {
    if (isSubmitting) {
      event.preventDefault();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      saveTrackMutation.reset();
      onClose();
    }
  };

  if (isEditMode && !track && isOpen) {
    return null;
  }

  const initialData = isEditMode
    ? track
    : { title: "", artist: "", album: "", genres: [], coverImage: "" };

  const icon = isEditMode ? (
    <Pencil className="h-5 w-5 text-muted-foreground" />
  ) : (
    <PlusCircle className="h-5 w-5 text-muted-foreground" />
  );

  const title = isEditMode ? "Edit Track Details" : "Create New Track";
  const description = isEditMode
    ? `Make changes to ${track?.title || "this track"}.`
    : "Add a new track to your collection";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-3xl h-[90vh] flex flex-col p-0"
        onInteractOutside={handleInteractOutside}
        onEscapeKeyDown={handleInteractOutside}
      >
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
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
          <Alert variant="destructive" className="mx-6 mb-4 flex-shrink-0">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[450px] px-6">
          <div className="pb-4">
            <TrackForm
              id={formId}
              initialData={initialData as Partial<TrackFormData>}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 pt-4 border-t flex-shrink-0 sm:justify-between">
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
