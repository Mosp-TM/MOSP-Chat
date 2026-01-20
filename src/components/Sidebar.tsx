import React from "react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import SettingsDialog from "./SettingsDialog";
import { useAppStore, type Chat } from "../store/appStore";

const Sidebar: React.FC = () => {
  const { chats, addChat, currentChatId, setCurrentChatId, deleteChat } =
    useAppStore();

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
          <div
            key={chat.id}
            className={`group w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
              currentChatId === chat.id ? "bg-muted font-medium" : ""
            }`}>
            <button
              onClick={() => setCurrentChatId(chat.id)}
              className="flex-1 flex items-center gap-2 overflow-hidden text-left">
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{chat.title || "Untitled Chat"}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
              title="Delete Chat">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <SettingsDialog />
      </div>
    </div>
  );
};

export default Sidebar;
