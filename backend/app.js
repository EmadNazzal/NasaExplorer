const express = require("express");
const cors = require("cors");
const nasaRoutes = require("./routes/nasaRoutes");
const groqRoutes = require("./routes/groqRoutes");

const app = express();

// ✅ Set allowed frontend origin explicitly
const allowedOrigins = [
  "https://nasa-explorer-client-1zdtntrzn-emadnazzals-projects.vercel.app",
  "https://nasa-explorer-client-xi.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/nasa", nasaRoutes);
app.use("/api/groq", groqRoutes);

module.exports = app;
