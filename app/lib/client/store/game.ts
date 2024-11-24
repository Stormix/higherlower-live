import type { OptionDto } from "@/lib/dto/question";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface GameState {
  duration: number;
  setDuration: (duration: number | ((prev: number) => number)) => void;
  gameId: string | null;
  setGameId: (gameId: string) => void;
  options: OptionDto[];
  setOptions: (options: OptionDto[] | null) => void;
  winner: string | undefined;
  setWinner: (winner: string) => void;
  answer: number | undefined;
  setAnswer: (answer: number) => void;
  timeElapsed: number;
  setTimeElapsed: (timeElapsed: number) => void;
  isStarted: boolean;
  setIsStarted: (isStarted: boolean) => void;
  reset: () => void;
  startGame: (params: Partial<GameState>) => void;
  updateVotes: (votes: [number, number]) => void;
}

export const useGameStore = create<GameState>()(
  devtools((set) => ({
    duration: 0,
    setDuration: (duration) =>
      set((state) => ({
        duration:
          typeof duration === "function" ? duration(state.duration) : duration,
      })),
    gameId: null,
    setGameId: (gameId) => set({ gameId }),
    options: [],
    setOptions: (options) => set({ options: options ?? [] }),
    winner: undefined,
    setWinner: (winner) => set({ winner }),
    answer: undefined,
    setAnswer: (answer) => set({ answer }),
    timeElapsed: 0,
    setTimeElapsed: (timeElapsed) => set({ timeElapsed }),
    isStarted: false,
    setIsStarted: (isStarted) => set({ isStarted }),
    reset: () =>
      set({
        isStarted: false,
        options: [],
        answer: undefined,
        gameId: null,
        winner: undefined,
        timeElapsed: 0,
      }),
    startGame: (params) => set({ ...params }),
    updateVotes: (votes) =>
      set((state) => ({
        options: state.options.map((option, index) => ({
          ...option,
          votes: votes[index],
        })),
      })),
  }))
);
