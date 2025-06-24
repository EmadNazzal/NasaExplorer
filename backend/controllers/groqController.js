const { askGroq } = require("../services/groqService");

exports.askAI = async (req, res) => {
  console.log("🧪 Received body:", req.body); // ADD THIS

  const prompt = req.body?.prompt;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Prompt is required." });
  }

  try {
    const answer = await askGroq(prompt);
    res.json({ answer });
  } catch (error) {
    console.error(
      "🔥 Groq controller error:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: error.message });
  }
};
