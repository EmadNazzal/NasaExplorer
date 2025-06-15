const express = require('express');
const cors = require('cors');
const nasaRoutes = require('./routes/nasaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/nasa', nasaRoutes);

module.exports = app;
