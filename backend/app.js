const express = require("express");
const cors = require("cors");
const nasaRoutes = require("./routes/nasaRoutes");
const groqRoutes = require("./routes/groqRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/nasa", nasaRoutes);
app.use("/api/groq", groqRoutes);

module.exports = app;
