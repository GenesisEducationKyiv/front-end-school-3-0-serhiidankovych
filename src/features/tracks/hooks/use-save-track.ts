import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "../api/api";
import { Track, TrackFormData } from "../schemas/schemas";

type SaveTrackVariables = {
  data: TrackFormData;
  id?: string;
};

export const useSaveTrack = () => {
  const queryClient = useQueryClient();

  return useMutation<Track, ApiError, SaveTrackVariables>({
    mutationFn: ({ data, id }) => {
      if (id) {
        return api.updateTrack(id, data);
      }

      return api.createTrack(data);
    },

    onSuccess: (savedTrack, variables) => {
      const actionText = variables.id ? "updated" : "created";
      toast.success(`Track ${actionText}`, {
        description: `"${savedTrack.title}" was ${actionText} successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ["tracks"] });

      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["track", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["track", savedTrack.slug] });
      }
    },
  });
};
