import { useQuery } from "@tanstack/react-query";
import { fetchMarsRoverPhotos } from "../api/nasa";

export const useMarsRoverPhotos = (params, options = {}) => {
  return useQuery({
    queryKey: ["mars-rover", params],
    queryFn: () => fetchMarsRoverPhotos(params),
    enabled: !!params?.sol,
    ...options,
  });
};
