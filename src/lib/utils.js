import { clsx } from "https://esm.sh/clsx";
import { twMerge } from "https://esm.sh/tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
