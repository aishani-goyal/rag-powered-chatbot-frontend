// src/components/Message/MessageList.js
import React from "react";
import Message from "./Message";
import StreamingMessage from "./StreamingMessage";
import "./Message.scss";

const MessageList = ({ messages, streamingMessage, isStreaming }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message
          key={`${message.timestamp}-${index}`}
          message={message}
          isLast={index === messages.length - 1}
        />
      ))}

      {/* Show streaming message while assistant is responding */}
      {isStreaming && streamingMessage && (
        <StreamingMessage
          content={streamingMessage.content || ""}
          sources={streamingMessage.sources || []}
        />
      )}
    </div>
  );
};

export default MessageList;