import { useQuery } from "@tanstack/react-query";

import { api, ApiError } from "../api/api";

export const useArtists = () => {
  return useQuery<string[], ApiError>({
    queryKey: ["artists"],
    queryFn: api.getArtists,
  });
};
