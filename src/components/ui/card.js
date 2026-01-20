import { cn } from "../../lib/utils.js";

export function createCard({ className = "" } = {}) {
  const card = document.createElement("div");
  card.className = cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className,
  );
  return card;
}

export function createCardHeader({ className = "" } = {}) {
  const header = document.createElement("div");
  header.className = cn("flex flex-col space-y-1.5 p-6", className);
  return header;
}

export function createCardTitle({ text = "", className = "" } = {}) {
  const title = document.createElement("h3");
  title.className = cn(
    "text-2xl font-semibold leading-none tracking-tight",
    className,
  );
  title.textContent = text;
  return title;
}

export function createCardDescription({ text = "", className = "" } = {}) {
  const desc = document.createElement("p");
  desc.className = cn("text-sm text-muted-foreground", className);
  desc.textContent = text;
  return desc;
}

export function createCardContent({ className = "" } = {}) {
  const content = document.createElement("div");
  content.className = cn("p-6 pt-0", className);
  return content;
}
