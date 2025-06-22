import { useQuery } from "@tanstack/react-query";
import { fetchNEOData } from "../api/nasa";

export const useNearEarth = (params, options = {}) =>
  useQuery({
    queryKey: ["neo", params],
    queryFn: () => fetchNEOData(params),
    enabled: false,
    ...options,
  });
