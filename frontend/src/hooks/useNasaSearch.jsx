// useNasaSearch.jsx (NEW)
import { useQuery } from "@tanstack/react-query";
import { searchNasaMedia } from "../api/nasa";

export const useNasaSearch = (params, options = {}) => {
  return useQuery({
    queryKey: ["nasa-search", JSON.stringify(params)], // Use params directly in queryKey
    queryFn: () => searchNasaMedia(params),
    enabled: false, // Keep enabled: false if you want to manually trigger
    ...options,
  });
};
