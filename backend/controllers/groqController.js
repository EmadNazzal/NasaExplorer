const { askGroq } = require("../services/groqService");

exports.askAI = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required." });
  }

  try {
    const answer = await askGroq(prompt);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
