import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Copy, Edit2, Check, ArrowUp } from "lucide-react";
import { type Message } from "../../store/appStore";
import { Button } from "../ui/button";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  streamingContent: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onRegenerateFromPoint?: (index: number, newContent: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  streamingContent,
  messagesEndRef,
  onRegenerateFromPoint,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleEdit = (index: number, content: string) => {
    setEditingIndex(index);
    setEditContent(content);
  };

  const handleSaveEdit = (index: number) => {
    if (onRegenerateFromPoint && editContent.trim()) {
      onRegenerateFromPoint(index, editContent);
      setEditingIndex(null);
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditContent("");
  };

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {messages.length === 0 && !streamingContent && (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 animate__animated animate__fadeIn">
          <span className="text-4xl mb-4">💬</span>
          <p>Start a conversation...</p>
        </div>
      )}
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate__animated animate__fadeIn animate__faster group`}>
          <div className="relative max-w-[75%]">
            {editingIndex === i ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[100px] rounded-lg px-4 py-2 bg-primary/10 border border-primary resize-y"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => handleSaveEdit(i)}
                    title="Send edited message">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted prose dark:prose-invert prose-sm break-words"
                  }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 rounded-full shadow-md"
                    onClick={() => handleCopy(msg.content, i)}
                    title="Copy message">
                    {copiedIndex === i ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  {msg.role === "user" && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7 rounded-full shadow-md"
                      onClick={() => handleEdit(i, msg.content)}
                      title="Edit message">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      {loading && streamingContent && (
        <div className="flex justify-start animate__animated animate__fadeIn animate__faster">
          <div className="bg-muted rounded-lg px-4 py-2 max-w-[75%] prose dark:prose-invert prose-sm break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {streamingContent}
            </ReactMarkdown>
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          </div>
        </div>
      )}
      {loading && !streamingContent && (
        <div className="flex justify-start animate__animated animate__fadeIn">
          <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
