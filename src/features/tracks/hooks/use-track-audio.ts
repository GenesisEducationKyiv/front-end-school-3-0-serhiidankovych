import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, ApiError } from "../api/api";
import { Track } from "../schemas/schemas";

export const useUploadTrackAudio = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Track,
    ApiError,
    { trackId: string; file: File; fileName: string }
  >({
    mutationFn: ({ trackId, file }) => api.uploadTrackAudio(trackId, file),

    onSuccess: (updatedTrack, variables) => {
      toast.success("Upload successful", {
        description: `Audio file "${variables.fileName}" has been uploaded.`,
      });

      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["track", updatedTrack.id] });
      queryClient.invalidateQueries({ queryKey: ["track", updatedTrack.slug] });
    },

    onError: (error) => {
      toast.error("Upload failed", {
        description: error.message,
      });
    },
  });
};

export const useRemoveTrackAudio = () => {
  const queryClient = useQueryClient();

  return useMutation<Track, ApiError, string>({
    mutationFn: (trackId) => api.removeTrackAudio(trackId),

    onSuccess: (updatedTrack) => {
      toast.success("File removed", {
        description: "The audio file has been removed from this track.",
      });

      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["track", updatedTrack.id] });
      queryClient.invalidateQueries({ queryKey: ["track", updatedTrack.slug] });
    },

    onError: (error) => {
      toast.error("Failed to remove file", {
        description: error.message,
      });
    },
  });
};
