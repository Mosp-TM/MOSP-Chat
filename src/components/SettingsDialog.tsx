import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { useAppStore } from "../store/appStore";
import { checkOllamaInstalled, getOllamaModels } from "../lib/ollama";
import { Settings as SettingsIcon } from "lucide-react";

const SettingsDialog: React.FC = () => {
  const { provider, model, apiKeys, setProvider, setModel, setApiKey } =
    useAppStore();

  const [localProvider, setLocalProvider] = useState(provider);
  const [localModel, setLocalModel] = useState(model);
  const [localApiKey, setLocalApiKey] = useState("");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setLocalProvider(provider);
      setLocalModel(model);
      setLocalApiKey(apiKeys[provider] || "");

      if (provider === "ollama" || localProvider === "ollama") {
        loadOllamaModels();
      }
    }
  }, [open, provider, model, apiKeys]);

  useEffect(() => {
    if (localProvider === "ollama") {
      loadOllamaModels();
    } else {
      setLocalApiKey(apiKeys[localProvider] || "");
    }
  }, [localProvider, apiKeys]);

  const loadOllamaModels = async () => {
    const installed = await checkOllamaInstalled();
    if (installed) {
      const models = await getOllamaModels();
      setOllamaModels(models);
      if (models.length > 0 && !models.includes(localModel)) {
        setLocalModel(models[0]);
      }
    }
  };

  const handleSave = () => {
    setProvider(localProvider);
    if (localProvider === "ollama") {
      setModel(localModel);
    } else {
      setApiKey(localProvider, localApiKey);
      if (localProvider === "openai") setModel("gpt-4o");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center justify-center p-2 rounded-md hover:bg-slate-100 text-slate-500 w-full">
          <SettingsIcon className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="provider-settings">Provider</Label>
            <Select value={localProvider} onValueChange={setLocalProvider}>
              <SelectTrigger id="provider-settings">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ollama">Ollama</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {localProvider === "ollama" && (
            <div className="grid gap-2">
              <Label>Model</Label>
              <Select value={localModel} onValueChange={setLocalModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {ollamaModels.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {localProvider !== "ollama" && (
            <div className="grid gap-2">
              <Label htmlFor="apikey-settings">API Key</Label>
              <input
                id="apikey-settings"
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
