import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Title-case each word when the API stores names in lowercase. */
export function formatPersonDisplayName(first, last) {
  const word = (s) => {
    if (!s || typeof s !== "string") return "";
    const t = s.trim();
    if (!t) return "";
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  };
  return [word(first), word(last)].filter(Boolean).join(" ").trim();
}
