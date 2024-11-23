import type { TwitchMessage } from "@/types/twitch";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChatState {
  messages: TwitchMessage[];
  addMessage: (message: TwitchMessage) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        messages: [],
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, message].slice(-50),
          })),
      }),
      {
        version: 1,
        name: "twitch-chat",
      }
    )
  )
);
