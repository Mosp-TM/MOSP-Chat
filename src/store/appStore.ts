import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  hasCompletedSetup: boolean;
  provider: string;
  model: string;
  apiKeys: Record<string, string>;
  chats: Chat[];
  currentChatId: string | null;

  // Actions
  completeSetup: () => void;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  setApiKey: (provider: string, key: string) => void;
  addChat: (chat: Chat) => void;
  setCurrentChatId: (id: string | null) => void;
  getApiKey: (provider: string) => string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // State
      hasCompletedSetup: false,
      provider: "ollama",
      model: "",
      apiKeys: {},
      chats: [],
      currentChatId: null,

      // Actions
      completeSetup: () => set({ hasCompletedSetup: true }),

      setProvider: (provider) => set({ provider }),

      setModel: (model) => set({ model }),

      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),

      addChat: (chat) =>
        set((state) => ({
          chats: [chat, ...state.chats],
          currentChatId: chat.id,
        })),

      setCurrentChatId: (id) => set({ currentChatId: id }),

      // Helpers
      getApiKey: (provider) => get().apiKeys[provider] || "",
    }),
    {
      name: "chat-app-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export type { Chat, Message, AppState };
