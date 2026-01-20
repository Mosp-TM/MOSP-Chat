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
  const contentDiv = createMessageElement("assistant");
  contentDiv.innerHTML =
    '<span class="flex gap-1 items-center font-medium opacity-50 animate-pulse text-sm">Thinking...</span>';
  let fullResponse = "";

  try {
    // Keep only the last 20 messages for the request
    const historyToSend = conversationHistory.slice(-20);

    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        messages: [
          {
            role: "system",
            content:
              "You are Muradian AI. Give very simple, direct and accurate answers. No long intro or outro. Just the facts. If it is a list, use bullet points. Keep it clear.",
          },
          ...historyToSend,
        ],
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
          const chunkContent = data.message?.content;

          if (chunkContent !== undefined) {
            if (isFirstChunk && chunkContent !== "") {
              contentDiv.innerHTML = "";
              isFirstChunk = false;
            }
            fullResponse += chunkContent;

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
        const chunkContent = data.message?.content;
        if (chunkContent) {
          fullResponse += chunkContent;
          contentDiv.innerHTML = window.marked
            ? marked.parse(fullResponse)
            : fullResponse;
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
    // Remove the empty thinking message if it exists
    if (contentDiv && contentDiv.closest(".animate-slideIn")) {
      contentDiv.closest(".animate-slideIn").remove();
    }
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
  messageDiv.className = `flex flex-col ${isUser ? "items-end" : isError ? "items-center" : "items-start"} animate-slideIn gap-1`;

  const label = document.createElement("span");
  label.className =
    "text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1";
  label.textContent = isUser ? "You" : isError ? "System" : "Muradian AI";

  const messageClass = isUser
    ? "bg-primary text-primary-foreground"
    : isError
      ? "bg-destructive/10 text-destructive border border-destructive/20"
      : "bg-card border border-border";

  messageDiv.innerHTML = `
    <div class="flex flex-col ${isUser ? "items-end" : "items-start"} gap-1 w-full max-w-[85%]">
      ${!isError ? label.outerHTML : ""}
      <div class="${messageClass} rounded-2xl px-4 py-2.5 shadow-sm message-content w-full" data-type="${type}"></div>
    </div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return messageDiv.querySelector(".message-content");
}

function addMessage(content, type) {
  const contentDiv = createMessageElement(type);

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
  addMessage("Hi! I'm Muradian AI. How can I help you today?", "assistant");

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
