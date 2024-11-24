import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLoserMessage() {
  const options = [
    "Damn, you suck",
    "Skill issue, not a bug",
    "L chat",
    "Are you even trying?",
    "Maybe try voting next time",
    "Chat's collective IQ is showing",
    "This ain't it chief",
    "Touch grass maybe?",
    "Have you considered getting good?",
    "Mission failed successfully",
    "Peak chat performance right there",
    "Even bots are smarter than this",
  ];

  return options[Math.floor(Math.random() * options.length)];
}
