const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// APOD API
export const fetchAPODByDate = async (date) => {
  const res = await fetch(`${BASE_URL}/api/nasa/apod?date=${date}`);
  const json = await res.json();
  if (json.code) throw new Error(json.msg || "Failed to fetch APOD");
  return json;
};

//EPIC API
export const fetchEpicImages = async (date = "") => {
  const endpoint = date ? `/api/nasa/epic?date=${date}` : `/api/nasa/epic`;

  const res = await fetch(`http://localhost:5000${endpoint}`);
  if (!res.ok) throw new Error("Failed to fetch EPIC images");

  return res.json();
};

//Image and Video API

export const searchNasaMedia = async (params) => {
  // Construct the query string from the params object (e.g., { q: "apollo", media_type: "image" })
  const queryParams = new URLSearchParams(params).toString();

  // Call your backend endpoint with all the query parameters
  const res = await fetch(`${BASE_URL}/api/nasa/search?${queryParams}`);

  if (!res.ok) {
    // Handle HTTP errors from your backend (e.g., 400, 500)
    const errorData = await res.json();
    throw new Error(errorData.message || `API error: ${res.status}`);
  }

  const json = await res.json();

  // *** THIS IS THE CRITICAL CHANGE ***
  // Return the entire collection object, as it contains items, metadata, and links
  // This ensures searchResults in ImageAndVideo.jsx has the .collection structure you're expecting
  return (
    json.collection || { items: [], metadata: { total_hits: 0 }, links: [] }
  );
};

export const fetchNasaAsset = async (nasa_id) => {
  const res = await fetch(`http://localhost:5000/api/nasa/asset/${nasa_id}`);
  return res.json();
};

export const fetchNasaMetadata = async (nasa_id) => {
  const res = await fetch(`http://localhost:5000/api/nasa/metadata/${nasa_id}`);
  return res.json();
};

export const fetchNasaCaptions = async (nasa_id) => {
  const res = await fetch(`http://localhost:5000/api/nasa/captions/${nasa_id}`);
  return res.json();
};

// Mars Rover Photos - MPR

export const fetchMarsRoverPhotos = async ({ sol, page, camera }) => {
  let query = `sol=${sol}&page=${page}`;
  if (camera) query += `&camera=${camera}`;
  const res = await fetch(`http://localhost:5000/api/nasa/mars-rover?${query}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch photos");
  return json.photos || [];
};

// Near Earth Object - NeoWS

export const fetchNEOData = async ({ start_date, end_date }) => {
  const res = await fetch(
    `http://localhost:5000/api/nasa/neo?start_date=${start_date}&end_date=${end_date}`
  );
  const json = await res.json();
  if (!res.ok) throw new Error("Failed to fetch NEO data");
  return Object.values(json.near_earth_objects).flat();
};
