import type { Message, Option } from "@/types/socket";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "./ws";

interface GameContextType {
  isStarted: boolean;
  options: Array<Option> | null;
  answer: number | null;
  gameId: string | null;
  winner: string | null;
  timeElapsed: number;
  start: (userId: string, lastGameId?: string) => void;
}

const GameContext = createContext<GameContextType>({
  isStarted: false,
  options: null,
  answer: null,
  gameId: null,
  winner: null,
  timeElapsed: 0,
  start: () => {},
});

export const useGame = () => useContext(GameContext);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const { socket } = useWebSocket();
  const [isStarted, setIsStarted] = useState(false);
  const [options, setOptions] = useState<Array<Option> | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null);

  const start = (userId: string, lastGameId?: string) => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "play",
        payload: { userId, lastGameId },
      }),
    );
  };

  const resetGame = () => {
    setIsStarted(false);
    setOptions(null);
    setGameId(null);
    setWinner(null);
    setTimeElapsed(0);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as Message;

      switch (message.type) {
        case "startGame": {
          resetGame();
          setIsStarted(true);
          setOptions(message.payload.options);
          setGameId(message.payload.gameId);

          // Start timer
          const interval = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
          }, 1000);
          setTimer(interval);
          break;
        }
        case "endGame": {
          setWinner(message.payload.winner);
          setAnswer(message.payload.answer);

          if (timer) {
            clearInterval(timer);
            setTimer(null);
          }
          break;
        }
        case "votes": {
          setOptions(message.payload.options);
          break;
        }
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, timer]);

  return (
    <GameContext.Provider
      value={{
        isStarted,
        options,
        gameId,
        winner,
        timeElapsed,
        answer,
        start,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
