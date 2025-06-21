const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchAPODByDate = async (date) => {
  const res = await fetch(`${BASE_URL}/api/nasa/apod?date=${date}`);
  const json = await res.json();
  if (json.code) throw new Error(json.msg || "Failed to fetch APOD");
  return json;
};
