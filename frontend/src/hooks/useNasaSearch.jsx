import { useQuery } from "@tanstack/react-query";
import { searchNasaMedia } from "../api/nasa";

export const useNasaSearch = (query, options = {}) => {
  return useQuery({
    queryKey: ["nasa-search", query],
    queryFn: () => searchNasaMedia(query),
    enabled: false,
    ...options,
  });
};
