export function ChatMessage({ content, type }) {
  const isUser = type === "user";
  const isError = type === "error";

  const messageClass = isUser
    ? "ml-auto bg-gradient-to-r from-purple-600 to-purple-700 text-white"
    : isError
      ? "mx-auto bg-red-50 text-red-600 border border-red-200"
      : "mr-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";

  return `
    <div class="flex ${isUser ? "justify-end" : isError ? "justify-center" : "justify-start"} animate-slideIn">
      <div class="${messageClass} rounded-2xl px-4 py-3 max-w-[80%] shadow-sm message-content" data-type="${type}">
        ${isUser || isError ? escapeHtml(content) : content}
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
