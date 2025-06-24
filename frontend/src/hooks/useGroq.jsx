// hooks/useGroq.jsx
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { groqAPI } from "../api/groqHandler";

export const useGroq = () => {
  return useMutation({
    mutationFn: groqAPI.askAI,
    onError: (error) => {
      console.error("AI Query Error:", error);
    },
  });
};

// Optional: For conversation history management
export const useGroqConversation = () => {
  const [conversation, setConversation] = useState([]);
  const groqMutation = useGroq();

  const addMessage = (message, isUser = true) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      isUser,
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, newMessage]);
  };

  const askAI = async (prompt) => {
    // Add user message
    addMessage(prompt, true);

    try {
      const response = await groqMutation.mutateAsync(prompt);
      // Add AI response
      addMessage(response.answer, false);
      return response;
    } catch (error) {
      // Add error message
      addMessage("Sorry, I encountered an error. Please try again.", false);
      throw error;
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return {
    conversation,
    askAI,
    clearConversation,
    isLoading: groqMutation.isPending,
    error: groqMutation.error,
  };
};
