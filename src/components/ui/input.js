import { cn } from "../../lib/utils.js";

export function createInput({
  placeholder = "",
  type = "text",
  id = "",
  autocomplete = "off",
  disabled = false,
  className = "",
}) {
  const inputClass = cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );

  const input = document.createElement("input");
  input.type = type;
  if (id) input.id = id;
  input.placeholder = placeholder;
  input.autocomplete = autocomplete;
  input.disabled = disabled;
  input.className = inputClass;

  return input;
}
