import React from "react";

interface ChatHeaderProps {
  title?: string;
  provider: string;
  model: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "Muradian AI",
  provider,
  model,
}) => {
  return (
    <header className="border-b bg-background p-4 flex items-center gap-3">
      <span className="text-2xl">🤖</span>
      <div>
        <h1 className="text-xl font-semibold leading-none">{title}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Provider: {provider} | Model: {model}
        </p>
      </div>
    </header>
  );
};

export default ChatHeader;
