const axios = require('axios');
const API_KEY = process.env.NASA_API_KEY;

exports.fetchAPOD = async () => {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
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

exports.searchImageLibrary = async (q) => {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}`;
  const response = await axios.get(url);
  return response.data;
};
