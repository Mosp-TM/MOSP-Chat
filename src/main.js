import { createChatApp } from "./components/ChatApp.js";

let messageInput;
let chatMessages;
let sendBtn;
let contextValue;
let conversationHistory = [];

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, "user");
  conversationHistory.push({ role: "user", content: message });
  updateContextCounter();

  messageInput.value = "";
  sendBtn.disabled = true;

  // Create placeholder for streaming response
  const assistantMessageDiv = createMessageElement("assistant");
  const contentDiv = assistantMessageDiv.querySelector(".message-content");
  contentDiv.innerHTML =
    '<span class="flex gap-1 items-center font-medium opacity-50 animate-pulse">Thinking...</span>';
  let fullResponse = "";

  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        prompt: message,
        system:
          "You are Muradian AI, a helpful and knowledgeable AI assistant. You provide clear, accurate, and detailed responses to help users with their questions.",
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get response from Ollama (${response.status})`,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let isFirstChunk = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last partial line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data.response !== undefined) {
            if (isFirstChunk && data.response !== "") {
              contentDiv.innerHTML = "";
              isFirstChunk = false;
            }
            fullResponse += data.response;

            // Only update DOM if there's actually something to show or we need to clear "Thinking..."
            if (!isFirstChunk) {
              contentDiv.innerHTML = window.marked
                ? marked.parse(fullResponse)
                : fullResponse;
              renderMath(contentDiv);
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          }

          if (data.done) {
            // Handle completion if needed
          }
        } catch (e) {
          console.error("Error parsing chunk:", e, line);
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer);
        if (data.response) {
          fullResponse += data.response;
          contentDiv.innerHTML = marked.parse(fullResponse);
          renderMath(contentDiv);
        }
      } catch (e) {
        // Final buffer might not be valid JSON if it's just whitespace
      }
    }

    // Add to conversation history
    conversationHistory.push({ role: "assistant", content: fullResponse });
    updateContextCounter();
  } catch (error) {
    console.error("Error:", error);
    contentDiv.remove();
    assistantMessageDiv.remove();
    addMessage(
      "Error: Could not connect to Ollama. Make sure Ollama is running.",
      "error",
    );
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

function createMessageElement(type) {
  const isUser = type === "user";
  const isError = type === "error";

  const messageDiv = document.createElement("div");
  messageDiv.className = `flex ${isUser ? "justify-end" : isError ? "justify-center" : "justify-start"} animate-slideIn`;

  const messageClass = isUser
    ? "ml-auto bg-primary text-primary-foreground"
    : isError
      ? "mx-auto bg-destructive/10 text-destructive border border-destructive/20"
      : "mr-auto bg-card border border-border";

  messageDiv.innerHTML = `
    <div class="${messageClass} rounded-lg px-4 py-3 max-w-[80%] shadow-sm message-content" data-type="${type}"></div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return messageDiv;
}

function addMessage(content, type) {
  const messageDiv = createMessageElement(type);
  const contentDiv = messageDiv.querySelector(".message-content");

  if (type === "assistant") {
    contentDiv.innerHTML = window.marked ? marked.parse(content) : content;
    renderMath(contentDiv);
  } else {
    contentDiv.textContent = content;
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function updateContextCounter() {
  const totalTokens = conversationHistory.reduce((total, msg) => {
    return total + estimateTokens(msg.content);
  }, 0);

  contextValue.textContent = `${totalTokens.toLocaleString()} tokens`;
}

function renderMath(element) {
  if (!window.katex) return;
  // Render inline math: \( ... \)
  element.innerHTML = element.innerHTML.replace(
    /\\\(([^\)]+)\\\)/g,
    (match, math) => {
      try {
        return katex.renderToString(math, { displayMode: false });
      } catch (e) {
        return match;
      }
    },
  );

  // Render display math: \[ ... \]
  element.innerHTML = element.innerHTML.replace(
    /\\\[([^\]]+)\\\]/g,
    (match, math) => {
      try {
        return katex.renderToString(math, { displayMode: true });
      } catch (e) {
        return match;
      }
    },
  );
}

function initApp() {
  // Create and mount the app
  const app = document.getElementById("app");
  if (!app) return;

  const chatApp = createChatApp();
  app.appendChild(chatApp);

  // Get DOM elements
  messageInput = document.querySelector("#message-input");
  chatMessages = document.querySelector("#chat-messages");
  sendBtn = document.querySelector("#send-btn");
  contextValue = document.querySelector("#context-value");

  // Add initial welcome message
  const welcomeDiv = document.createElement("div");
  welcomeDiv.className = "flex justify-start animate-slideIn";
  welcomeDiv.innerHTML = `
    <div class="mr-auto bg-card border border-border rounded-lg px-4 py-3 max-w-[80%] shadow-sm">
      Hi! I'm Muradian AI. How can I help you today?
    </div>
  `;
  chatMessages.appendChild(welcomeDiv);

  // Event listeners
  document.querySelector("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });

  messageInput.focus();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
