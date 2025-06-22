import { useQuery } from "@tanstack/react-query";
import { fetchEpicImages } from "../api/nasa";

export const useEpic = (date, options = {}) => {
  return useQuery({
    queryKey: ["epic", date || "latest"],
    queryFn: () => fetchEpicImages(date),
    enabled: !!date || options.enabled === false, // optional fetch trigger
    ...options,
  });
};
