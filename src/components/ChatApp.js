import { createButton } from "./ui/button.js";
import { createInput } from "./ui/input.js";
import { cn } from "../lib/utils.js";

export function createChatApp() {
  // Main container
  const container = document.createElement("div");
  container.className = "flex h-screen flex-col";

  // Header
  const header = createHeader();
  container.appendChild(header);

  // Messages area
  const messagesArea = document.createElement("div");
  messagesArea.id = "chat-messages";
  messagesArea.className = "relative overflow-auto flex-1 p-6 space-y-4";
  container.appendChild(messagesArea);

  // Input area
  const inputArea = createInputArea();
  container.appendChild(inputArea);

  return container;
}

function createHeader() {
  const header = document.createElement("div");
  header.className =
    "border-b bg-gradient-to-r from-primary to-purple-700 p-6 text-primary-foreground";

  const headerContent = document.createElement("div");
  headerContent.className = "flex items-center gap-3";

  const icon = document.createElement("span");
  icon.className = "text-3xl";
  icon.textContent = "🤖";

  const textContainer = document.createElement("div");

  const title = document.createElement("h1");
  title.className = "text-2xl font-semibold leading-none tracking-tight";
  title.textContent = "Muradian AI";

  const subtitle = document.createElement("p");
  subtitle.className = "text-sm text-primary-foreground/90 mt-1";
  subtitle.textContent = "Powered by DeepSeek-R1";

  textContainer.appendChild(title);
  textContainer.appendChild(subtitle);

  headerContent.appendChild(icon);
  headerContent.appendChild(textContainer);
  header.appendChild(headerContent);

  return header;
}

function createInputArea() {
  const inputContainer = document.createElement("div");
  inputContainer.className = "border-t p-4 bg-card";

  // Context counter
  const contextDiv = document.createElement("div");
  contextDiv.className = "mb-3 text-sm text-muted-foreground";

  const contextLabel = document.createElement("span");
  contextLabel.className = "font-medium";
  contextLabel.textContent = "Context:";

  const contextValue = document.createElement("span");
  contextValue.id = "context-value";
  contextValue.className = "ml-2 font-mono font-semibold text-primary";
  contextValue.textContent = "0 tokens";

  contextDiv.appendChild(contextLabel);
  contextDiv.appendChild(contextValue);

  // Form
  const form = document.createElement("form");
  form.id = "chat-form";
  form.className = "flex gap-3";

  const input = createInput({
    id: "message-input",
    placeholder: "Type your message...",
    className: "flex-1",
  });

  const sendButton = createButton({
    id: "send-btn",
    text: "Send",
    type: "submit",
  });

  form.appendChild(input);
  form.appendChild(sendButton);

  inputContainer.appendChild(contextDiv);
  inputContainer.appendChild(form);

  return inputContainer;
}
