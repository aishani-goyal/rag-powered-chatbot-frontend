// src/components/Header/Header.js
import React, { useState } from "react";
import { Newspaper, Plus, Info } from "lucide-react";
import "./Header.scss";

const Header = ({ onNewSession }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Newspaper size={24} />
              <h1>IntelliNews</h1>
            </div>
            <span className="subtitle">Your Personalized News Assistant</span>
          </div>

          <div className="header-right">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="info-button"
              title="About this chatbot"
            >
              <Info size={18} />
            </button>
            <button
              onClick={onNewSession}
              className="new-session-button"
              title="Start new conversation"
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="info-modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h3>About News Chat AI</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            <div className="info-modal-content">
              <p>
                This chatbot uses{" "}
                <strong>Retrieval-Augmented Generation (RAG)</strong> to answer
                questions about recent news articles. Here's how it works:
              </p>
              <ul>
                <li>
                  🔍 <strong>Retrieval:</strong> Searches through a database of
                  recent news articles
                </li>
                <li>
                  🧠 <strong>Generation:</strong> Uses AI to provide informed
                  responses based on the retrieved content
                </li>
                <li>
                  📚 <strong>Sources:</strong> Shows you the news articles used
                  to generate each response
                </li>
              </ul>

              <h4>Features:</h4>
              <ul>
                <li>Real-time streaming responses</li>
                <li>Source citations with links</li>
                <li>Session-based chat history</li>
                <li>Responsive design for all devices</li>
              </ul>

              <h4>Tech Stack:</h4>
              <div className="tech-badges">
                <span className="tech-badge">React</span>
                <span className="tech-badge">Node.js</span>
                <span className="tech-badge">Qdrant</span>
                <span className="tech-badge">Redis</span>
                <span className="tech-badge">Gemini AI</span>
                <span className="tech-badge">Jina Embeddings</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;