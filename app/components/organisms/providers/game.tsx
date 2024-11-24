import { useVotesQuery } from "@/lib/client/question.query";
import { type GameState, useGameStore } from "@/lib/client/store/game";
import type { Message } from "@/types/socket";
import { type ReactNode, createContext, useContext, useEffect, useRef } from "react";
import { useWebSocket } from "./ws";

interface GameContextType
  extends Pick<GameState, "isStarted" | "options" | "gameId" | "winner" | "timeElapsed" | "answer" | "duration"> {
  start: (userId: string, lastGameId?: string) => void;
}

const GameContext = createContext<GameContextType>({
  isStarted: false,
  options: [],
  answer: undefined,
  gameId: null,
  winner: undefined,
  timeElapsed: 0,
  duration: 0,
  start: () => {},
});

export const useGame = () => useContext(GameContext);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const { socket } = useWebSocket();
  const {
    isStarted,
    options,
    answer,
    gameId,
    winner,
    duration,
    timeElapsed,
    setOptions,
    setDuration,
    reset,
    startGame,
    setIsStarted,
    setAnswer,
    setWinner,
    updateVotes,
  } = useGameStore();

  const timerRef = useRef<Timer | null>(null);
  const { data: gameVotes, refetch } = useVotesQuery(gameId);

  const start = (userId: string, lastGameId?: string) => {
    if (!socket || isStarted) return;
    resetGame();
    socket.send(
      JSON.stringify({
        type: "play",
        payload: { userId, lastGameId },
      }),
    );
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const resetGame = () => {
    reset();
    clearTimer();
  };

  // Why so many useEffect? well, you're not meant to use a second
  // store for this and rely on derived state from react-query.
  // But I'm too lazy to change it now.
  useEffect(() => {
    updateVotes(gameVotes.votes);
    if (gameVotes.answer !== null && gameVotes.answer !== undefined) {
      setAnswer(gameVotes.answer);
    }
    if (gameVotes.winner !== undefined && gameVotes.winner !== null) {
      setWinner(gameVotes.winner);
    }
  }, [gameVotes, updateVotes, setAnswer, setWinner]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as Message;

      switch (message.type) {
        case "startGame": {
          resetGame();
          startGame({
            isStarted: true,
            options: message.payload.options,
            gameId: message.payload.gameId,
            duration: (new Date(message.payload.endsAt).getTime() - Date.now()) / 1000,
          });

          // Start timer
          const interval = setInterval(() => {
            setDuration((prevDuration) => {
              if (prevDuration - 1 <= 0 && timerRef.current) {
                setIsStarted(false);
                clearTimer();
                return 0;
              }
              return prevDuration - 1;
            });
            refetch();
          }, 1000);

          timerRef.current = interval;
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
      clearTimer();
    };
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
        isStarted,
        options,
        gameId,
        winner,
        timeElapsed,
        answer,
        duration,
        start,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
