const nasaService = require('../services/nasaService');

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
  const { q } = req.query;
  const data = await nasaService.searchImageLibrary(q);
  res.json(data);
};
