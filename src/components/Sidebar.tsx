import React from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import SettingsDialog from "./SettingsDialog";
import { useAppStore, type Chat } from "../store/appStore";

const Sidebar: React.FC = () => {
  const {
    chats,
    addChat,
    currentChatId,
    setCurrentChatId,
    deleteChat,
    isSidebarOpen,
    toggleSidebar,
  } = useAppStore();

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    addChat(newChat);
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-[70px]"
      } border-r bg-muted/20 flex flex-col h-full transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className={`w-full flex items-center gap-2 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 ${
            !isSidebarOpen && "px-2"
          }`}
          title="New Chat">
          <Plus className="h-4 w-4" />
          {isSidebarOpen && <span>New Chat</span>}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
              currentChatId === chat.id ? "bg-muted font-medium" : ""
            } ${!isSidebarOpen && "justify-center px-2"}`}>
            <button
              onClick={() => setCurrentChatId(chat.id)}
              className={`flex-1 flex items-center gap-2 overflow-hidden text-left ${
                !isSidebarOpen && "justify-center"
              }`}
              title={chat.title || "Untitled Chat"}>
              <MessageSquare className="h-4 w-4 shrink-0" />
              {isSidebarOpen && (
                <span className="truncate">
                  {chat.title || "Untitled Chat"}
                </span>
              )}
            </button>
            {isSidebarOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                title="Delete Chat">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex flex-col gap-2">
        <div
          className={`flex items-center gap-2 ${!isSidebarOpen && "flex-col"}`}>
          <div
            className={`${!isSidebarOpen ? "w-full flex justify-center" : "flex-1"}`}>
            <SettingsDialog />
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-200 rounded-md text-slate-500 transition-colors"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
            {isSidebarOpen ? (
              <ChevronsLeft className="h-5 w-5" />
            ) : (
              <ChevronsRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
