import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "../api/api";

export const useGenres = () => {
  return useQuery<string[], ApiError>({
    queryKey: ["genres"],
    queryFn: api.getGenres,
  });
};
