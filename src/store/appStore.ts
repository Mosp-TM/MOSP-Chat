import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  hasCompletedSetup: boolean;
  provider: string;
  model: string;
  apiKeys: Record<string, string>;
  chats: Chat[];
  currentChatId: string | null;
  // Split View State
  layout: "single" | "split";
  activePane: "primary" | "secondary";
  primaryChatId: string | null;
  secondaryChatId: string | null;

  // Actions
  completeSetup: () => void;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  setApiKey: (provider: string, key: string) => void;
  addChat: (chat: Chat) => void;
  setCurrentChatId: (id: string | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  updateChatConfig: (chatId: string, config: Partial<Chat["config"]>) => void;
  deleteChat: (chatId: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  getApiKey: (provider: string) => string;

  // Split View Actions
  enableSplitView: (chatId: string) => void;
  closeSplitView: () => void;
  setPaneChat: (pane: "primary" | "secondary", chatId: string) => void;
  setActivePane: (pane: "primary" | "secondary") => void;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  config?: {
    provider: string;
    model: string;
  };
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
      isSidebarOpen: true,

      // Split View State
      layout: "single",
      activePane: "primary",
      primaryChatId: null,
      secondaryChatId: null,

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
          primaryChatId: chat.id, // Default to primary
          activePane: "primary",
        })),

      setCurrentChatId: (id) => set({ currentChatId: id, primaryChatId: id }),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat,
          ),
        })),

      updateChatTitle: (chatId, title) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat,
          ),
        })),

      updateChatConfig: (chatId, config) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, config: { ...chat.config, ...config } as any }
              : chat,
          ),
        })),

      deleteChat: (chatId) =>
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== chatId);
          const isCurrentChat = state.currentChatId === chatId;

          return {
            chats: newChats,
            currentChatId: isCurrentChat ? null : state.currentChatId,
            primaryChatId:
              state.primaryChatId === chatId ? null : state.primaryChatId,
            secondaryChatId:
              state.secondaryChatId === chatId ? null : state.secondaryChatId,
            layout: state.secondaryChatId === chatId ? "single" : state.layout, // Close split if secondary deleted
          };
        }),

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // Helpers
      getApiKey: (provider) => get().apiKeys[provider] || "",

      // Split View Actions
      enableSplitView: (chatId) =>
        set((state) => ({
          layout: "split",
          secondaryChatId: chatId,
          activePane: "secondary",
        })),

      closeSplitView: () =>
        set((state) => ({
          layout: "single",
          secondaryChatId: null,
          activePane: "primary",
          currentChatId: state.primaryChatId,
        })),

      setPaneChat: (pane, chatId) =>
        set({
          [`${pane}ChatId`]: chatId,
          currentChatId: chatId,
          activePane: pane, // Automatically focus the pane we just set
        }),

      setActivePane: (pane) =>
        set((state) => ({
          activePane: pane,
          currentChatId:
            pane === "primary" ? state.primaryChatId : state.secondaryChatId,
        })),
    }),
    {
      name: "chat-app-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export type { Chat, Message, AppState };
