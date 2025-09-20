// src/components/Message/StreamingMessage.js
import React, { useState, useEffect } from "react";
import { Bot, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./Message.scss";

const StreamingMessage = ({ content, sources = [] }) => {
  const [displayContent, setDisplayContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect for streaming content
  useEffect(() => {
    if (content && currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayContent(content.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // Adjust speed as needed

      return () => clearTimeout(timer);
    } else if (content) {
      setDisplayContent(content);
    }
  }, [content, currentIndex]);

  // Reset when content changes (new streaming session)
  useEffect(() => {
    setDisplayContent("");
    setCurrentIndex(0);
  }, [content]);

  return (
    <div className="message assistant streaming">
      <div className="message-header">
        <div className="message-avatar">
          <Bot size={20} />
        </div>
        <div className="message-info">
          <span className="message-sender">Assistant</span>
          <span className="message-status">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            Typing...
          </span>
        </div>
      </div>

      <div className="message-content">
        {displayContent ? (
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="message-paragraph">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="message-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="message-italic">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="message-list">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="message-list numbered">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="message-list-item">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="message-blockquote">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="message-code-inline">{children}</code>
                ) : (
                  <pre className="message-code-block">
                    <code>{children}</code>
                  </pre>
                ),
            }}
          >
            {displayContent}
          </ReactMarkdown>
        ) : (
          <div className="thinking-indicator">
            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Thinking...</span>
          </div>
        )}

        {/* Show sources if available */}
        {sources.length > 0 && (
          <div className="sources-section">
            <div className="sources-header">
              <span>Found {sources.length} relevant sources</span>
            </div>
            <div className="sources-preview">
              {sources.slice(0, 2).map((source, index) => (
                <div key={index} className="source-preview-item">
                  <span className="source-preview-title">{source.title}</span>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-preview-link"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
              {sources.length > 2 && (
                <span className="source-preview-more">
                  +{sources.length - 2} more sources
                </span>
              )}
            </div>
          </div>
        )}

        {/* Cursor for typewriter effect */}
        {displayContent && currentIndex < content.length && (
          <span className="typing-cursor">|</span>
        )}
      </div>
    </div>
  );
};

export default StreamingMessage;