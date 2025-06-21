// src/hooks/useApod.js
import { useQuery } from "@tanstack/react-query";
import { fetchAPODByDate } from "../api/nasa";

export const useApod = (date, options = {}) => {
  return useQuery({
    queryKey: ["apod", date],
    queryFn: () => fetchAPODByDate(date),
    enabled: !!date, // only fetch if date is provided
    ...options,
  });
};
