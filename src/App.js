// src/App.js
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Chat from "./components/Chat/Chat";
import Header from "./components/Header/Header";
import { ChatProvider } from "./hooks/useChat";
import "./styles/main.scss";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize session on mount
    const initializeSession = () => {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setIsLoading(false);
    };

    initializeSession();
  }, []);

  const handleNewSession = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/sessions`, {
        method: "POST",
      });
      const data = await res.json();
      setSessionId(data.id); // use backend session ID
    } catch (err) {
      console.error("Failed to start new session:", err);
    }
  };


  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider sessionId={sessionId}>
      <div className="app">
        <Header onNewSession={handleNewSession} />
        <main className="main-content">
          <Chat sessionId={sessionId} />
        </main>
        <footer className="footer">
          <p>IntelliNews © 2025. All rights reserved.</p>
        </footer>
      </div>
    </ChatProvider>
  );
}

export default App;
