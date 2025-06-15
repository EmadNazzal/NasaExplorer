const express = require('express');
const router = express.Router();
const nasaController = require('../controllers/nasaController');

router.get('/apod', nasaController.getAPOD);
router.get('/mars-rover', nasaController.getMarsRoverPhotos);
router.get('/epic', nasaController.getEPIC);
router.get('/neo', nasaController.getNEOFeed);
router.get('/search', nasaController.searchLibrary);

module.exports = router;
