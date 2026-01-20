import React from "react";
import { Plus, MessageSquare } from "lucide-react";
import SettingsDialog from "./SettingsDialog";
import { useAppStore, type Chat } from "../store/appStore";

const Sidebar: React.FC = () => {
  const { chats, addChat, currentChatId, setCurrentChatId } = useAppStore();

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    addChat(newChat);
  };

  return (
    <div className="w-64 border-r bg-muted/20 flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
              currentChatId === chat.id ? "bg-muted font-medium" : ""
            }`}>
            <MessageSquare className="h-4 w-4" />
            <span className="truncate">{chat.title || "Untitled Chat"}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t">
        <SettingsDialog />
      </div>
    </div>
  );
};

export default Sidebar;
