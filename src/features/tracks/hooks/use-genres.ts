import { useQuery } from "@tanstack/react-query";

import { api, ApiError } from "@/features/tracks/api";

export const useGenresQuery = () => {
  return useQuery<string[], ApiError>({
    queryKey: ["genres"],
    queryFn: api.getGenres,
  });
};
