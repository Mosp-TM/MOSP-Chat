export function ChatInput({ onSend }) {
  return `
    <div class="border-t bg-white dark:bg-gray-900">
      <div class="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
        <span class="font-medium">Context:</span>
        <span id="context-value" class="ml-2 font-mono font-semibold text-purple-600 dark:text-purple-400">0 tokens</span>
      </div>
      <form id="chat-form" class="px-6 pb-4 flex gap-3">
        <input 
          id="message-input"
          type="text"
          placeholder="Type your message..."
          autocomplete="off"
          class="flex-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
        <button 
          id="send-btn"
          type="submit"
          class="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  `;
}
