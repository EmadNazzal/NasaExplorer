const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

exports.askGroq = async (userPrompt) => {
  try {
    const response = await axios.post(
      GROQ_ENDPOINT,
      {
        model: "llama3-70b-8192", // we can change this if we want, perhaps make it dyamic and leave it to the user to choose the model ?
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that explains NASA content clearly.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    throw new Error("Failed to get response from Groq.");
  }
};
