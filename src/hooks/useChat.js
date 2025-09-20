// src/hooks/useChat.js
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { chatAPI } from "../services/api";

const ChatContext = createContext();

const initialState = { messages: [], isLoading: false, error: null };

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    dispatch({
      type: "ADD_MESSAGE",
      payload: { role: "user", content: message },
    });

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await chatAPI.sendMessage(message);
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          role: "assistant",
          content: response.response,
          sources: response.sources,
        },
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  return (
    <ChatContext.Provider value={{ ...state, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
