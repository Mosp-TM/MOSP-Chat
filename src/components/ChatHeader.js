import { cn } from "../lib/utils.js";

export function ChatHeader() {
  return `
    <div class="flex items-center justify-between border-b bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 text-white shadow-lg">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <span>🤖</span>
          <span>Muradian AI</span>
        </h1>
        <p class="text-sm text-purple-100 mt-1">Powered by DeepSeek-R1</p>
      </div>
    </div>
  `;
}
