const express = require("express");
const cors = require("cors");
const nasaRoutes = require("./routes/nasaRoutes");
const groqRoutes = require("./routes/groqRoutes");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "https://nasa-explorer-client-1zdtntrzn-emadnazzals-projects.vercel.app",
  "https://nasa-explorer-client-xi.vercel.app",
  "https://nasa-explorer-client-git-master-emadnazzals-projects.vercel.app",
  "https://nasa-explorer-client-emadnazzals-projects.vercel.app",
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // if testing API directly
];

// Use CORS middleware with dynamic origin checking
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// Handle OPTIONS preflight requests for all routes
app.options("*", cors());

// Parse JSON bodies
app.use(express.json());

// Your API routes
app.use("/api/nasa", nasaRoutes);
app.use("/api/groq", groqRoutes);

module.exports = app;
