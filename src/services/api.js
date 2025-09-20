// src/services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

class ChatAPI {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.error || `HTTP ${response.status} - ${response.statusText}`,
          response.status,
          errorData
        );
      }
      return await response.json();
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(`Network error: ${error.message}`, 0, {
        originalError: error,
      });
    }
  }

  // Send chat message (non-streaming)
  async sendMessage(message) {
    return await this.request("/chat/message", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // Send chat message (streaming)
  async sendMessageStream(message) {
    const url = `${this.baseUrl}/chat/message/stream`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.error || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return this.parseSSEStream(response);
  }

  async *parseSSEStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith("data: ")) {
          try {
            yield JSON.parse(line.substring(6));
          } catch (err) {
            console.warn("Failed to parse SSE data:", line);
          }
        }
      }
    }
  }
}

// Export
export const chatAPI = new ChatAPI();
export default chatAPI;
