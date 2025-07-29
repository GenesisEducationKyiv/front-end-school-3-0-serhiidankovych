import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, ApiError } from "@/features/tracks/api";
import {
  MultipleDeleteResponse,
  SingleDeleteResponse,
} from "@/features/tracks/schemas/schemas";

type DeleteVariables = { ids: string[]; trackTitles: string[] };

export const useDeleteTracksMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleDeleteResponse | MultipleDeleteResponse,
    ApiError,
    DeleteVariables
  >({
    mutationFn: ({ ids }) => {
      if (ids.length > 1) {
        return api.multipleDeleteTracks(ids);
      }
      if (ids.length === 1) {
        return api.deleteTrack(ids[0]);
      }

      return Promise.resolve("No IDs provided");
    },

    onSuccess: (data, variables) => {
      const { ids, trackTitles } = variables;

      if (ids.length > 1 && typeof data === "object" && "success" in data) {
        if (data.failed?.length > 0) {
          toast.warning(
            `${data.success.length} tracks deleted, ${data.failed.length} failed.`,
            { description: `Failed IDs: ${data.failed.join(", ")}` }
          );
        } else {
          toast.success(`${ids.length} tracks deleted successfully.`);
        }
      } else if (ids.length === 1) {
        const singleTrackTitle = trackTitles[0] || "Track";
        toast.success("Track deleted", {
          description: `"${singleTrackTitle}" has been deleted successfully.`,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },

    onError: (error) => {
      toast.error("Delete failed", {
        description: error.message,
      });
    },
  });
};
