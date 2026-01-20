import { cn } from "../../lib/utils.js";

export function ScrollArea({ className = "" }) {
  return cn("relative overflow-auto", className);
}
