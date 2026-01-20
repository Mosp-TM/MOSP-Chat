import React, { useState, useEffect, useRef } from "react";
import { useAppStore, type Message } from "../store/appStore";
import ProviderDialog from "./ProviderDialog";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Send } from "lucide-react";
import { chatWithOllama } from "../lib/ollamaChat";

const ChatApp: React.FC = () => {
  const {
    hasCompletedSetup,
    provider,
    model,
    chats,
    currentChatId,
    addMessage,
    addChat,
  } = useAppStore();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current chat messages
  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    // Ensure we have a valid chat session
    let activeChatId = currentChatId;
    if (!activeChatId) {
      const newChat = {
        id: Date.now().toString(),
        title: inputValue.slice(0, 30) + (inputValue.length > 30 ? "..." : ""),
        messages: [],
      };
      addChat(newChat);
      activeChatId = newChat.id;
    }

    const userMsg: Message = { role: "user", content: inputValue };
    addMessage(activeChatId!, userMsg);
    setInputValue("");
    setLoading(true);
    setStreamingContent("");

    // Create a temporary updated message list for context
    const updatedMessages = [
      ...(chats.find((c) => c.id === activeChatId)?.messages || []),
      userMsg,
    ];

    try {
      if (provider === "ollama") {
        // Send last 20 messages as context
        const contextMessages = updatedMessages.slice(-20);
        let accumulatedContent = "";

        await chatWithOllama(model, contextMessages, (chunk) => {
          accumulatedContent += chunk;
          setStreamingContent(accumulatedContent);
        });

        addMessage(activeChatId!, {
          role: "assistant",
          content: accumulatedContent,
        });
        setStreamingContent("");
      } else {
        // Other providers (TODO: implement)
        addMessage(activeChatId!, {
          role: "assistant",
          content: `${model} integration via ${provider} coming soon!`,
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage(activeChatId!, {
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!hasCompletedSetup ? (
        <ProviderDialog open={true} />
      ) : (
        <>
          <Sidebar />

          <div className="flex-1 flex flex-col h-full relative">
            {/* Header */}
            <header className="border-b bg-background p-4 flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h1 className="text-xl font-semibold leading-none">
                  Muradian AI
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Provider: {provider} | Model: {model}
                </p>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.length === 0 && !streamingContent && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <span className="text-4xl mb-4">💬</span>
                  <p>Start a conversation...</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && streamingContent && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                    {streamingContent}
                    <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                  </div>
                </div>
              )}
              {loading && !streamingContent && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-card">
              <div className="mb-2 text-xs text-muted-foreground flex justify-between">
                <span>
                  Context:{" "}
                  <span className="font-mono text-primary font-bold">
                    {messages.length} messages
                  </span>
                </span>
              </div>
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" disabled={loading || !inputValue.trim()}>
                  <Send className="h-4 w-4 mr-2" /> Send
                </Button>
              </form>
            </div>
          </div>

          <ProviderDialog open={!hasCompletedSetup} />
        </>
      )}
    </div>
  );
};

export default ChatApp;
