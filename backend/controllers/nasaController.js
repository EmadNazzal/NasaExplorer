const nasaService = require("../services/nasaService");

exports.getAPOD = async (req, res) => {
  const data = await nasaService.fetchAPOD();
  res.json(data);
};

exports.getMarsRoverPhotos = async (req, res) => {
  const { sol = 1000 } = req.query;
  const data = await nasaService.fetchMarsRoverPhotos(sol);
  res.json(data);
};

exports.getEPIC = async (req, res) => {
  const data = await nasaService.fetchEPIC();
  res.json(data);
};

exports.getNEOFeed = async (req, res) => {
  const { start_date, end_date } = req.query;
  const data = await nasaService.fetchNEOFeed(start_date, end_date);
  res.json(data);
};

exports.searchLibrary = async (req, res) => {
  // Pass all query parameters received from the frontend
  const queryParams = req.query; // req.query is already an object { q: "...", media_type: "...", ... }

  try {
    const data = await nasaService.searchImageLibrary(queryParams);
    res.json(data);
  } catch (error) {
    console.error("Error in searchLibrary controller:", error);
    // You should send a proper error response to the frontend
    res
      .status(500)
      .json({
        message: "Failed to fetch NASA media from backend.",
        error: error.message,
      });
  }
};
