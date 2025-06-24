// api/groqHandler.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const groqAPI = {
  askAI: async (prompt) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/groq/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Groq API error:", error);
      throw new Error("Failed to communicate with AI assistant");
    }
  },
};
