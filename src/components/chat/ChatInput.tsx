import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Paperclip, ArrowUp, Book } from "lucide-react";
import ModelSelector from "./ModelSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: (e: React.FormEvent) => void;
  loading: boolean;
  provider: string;
  model: string;
  models: string[];
  setModel: (model: string) => void;
  handleStop?: () => void;
  rules?: string;
  onUpdateRules?: (rules: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSend,
  loading,
  provider,
  model,
  models,
  setModel,
  handleStop,
  rules = "",
  onUpdateRules,
}) => {
  const [localRules, setLocalRules] = React.useState(rules);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalRules(rules);
  }, [rules]);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission if inside a form
    if (onUpdateRules) {
      onUpdateRules(localRules);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-transparent">
      <div className="w-full max-w-4xl mx-auto">
        <form
          onSubmit={handleSend}
          className="relative flex items-end gap-2 bg-background/60 dark:bg-muted/30 backdrop-blur-xl rounded-[2rem] p-2 pl-6 border border-border/40 shadow-2xl hover:shadow-primary/5 hover:border-border/60 transition-all duration-300 ring-1 ring-white/10">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 min-h-[50px] max-h-[200px] py-3.5 border-none bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-base placeholder:text-muted-foreground/70"
            autoFocus
          />

          <div className="flex items-center gap-2 pb-2 pr-2">
            <ModelSelector
              provider={provider}
              model={model}
              models={models}
              setModel={setModel}
            />

            <div className="h-4 w-[1px] bg-border mx-1" />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors ${rules ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                  title="Chat Rules">
                  <Book className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl border-border/50 bg-background/90 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>Chat Rules</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Set specific instructions for this chat.
                  </p>
                  <Textarea
                    value={localRules}
                    onChange={(e) => setLocalRules(e.target.value)}
                    placeholder="E.g., 'Be concise', 'Use Python'..."
                    className="min-h-[150px] bg-muted/50 border-border/50 rounded-2xl focus-visible:ring-primary/50"
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSaveRules}
                    type="button"
                    className="rounded-xl">
                    Save Rules
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
              <Paperclip className="h-4 w-4" />
            </Button>

            {loading ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (handleStop) handleStop();
                }}
                className="rounded-full h-10 w-10 p-0 bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25 transition-all">
                <div className="h-3 w-3 bg-current rounded-[2px]" />
                <span className="sr-only">Stop</span>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!inputValue.trim()}
                className="rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all">
                <ArrowUp className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
