const express = require("express");
const router = express.Router();
const groqController = require("../controllers/groqController");

router.post("/ask", groqController.askAI);

module.exports = router;
