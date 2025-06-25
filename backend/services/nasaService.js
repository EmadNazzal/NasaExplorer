const axios = require("axios");
const API_KEY = process.env.NASA_API_KEY;

exports.fetchAPOD = async (reqQuery = {}) => {
  const { date } = reqQuery;
  console.log("Fetching APOD with date:", date);
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${
    date ? `&date=${date}` : ""
  }`;
  try {
    console.log("Sending request to NASA API:", url);
    const response = await axios.get(url, { timeout: 10000 }); // 10-second timeout
    console.log("Received response from NASA API");
    return response.data;
  } catch (error) {
    console.error("NASA API error:", error.message);
    throw new Error(`Failed to fetch APOD: ${error.message}`);
  }
};

exports.fetchMarsRoverPhotos = async (sol) => {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

exports.fetchEPIC = async () => {
  const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

exports.fetchNEOFeed = async (start_date, end_date) => {
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

exports.searchImageLibrary = async (params) => {
  // Now accepts an object of parameters
  // Filter out empty string parameters before sending to NASA API (good practice)
  const filteredParams = {};
  for (const key in params) {
    if (
      params[key] !== null &&
      params[key] !== undefined &&
      String(params[key]).trim() !== ""
    ) {
      filteredParams[key] = params[key];
    }
  }

  // Construct the URL query string from the filtered parameters
  const queryString = new URLSearchParams(filteredParams).toString();
  const url = `https://images-api.nasa.gov/search?${queryString}`;

  console.log("Backend calling NASA API with URL:", url); // For debugging

  const response = await axios.get(url);
  return response.data;
};
