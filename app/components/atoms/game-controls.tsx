import { useGame } from "../organisms/providers/game";

const GameControls = () => {
  const { timeElapsed } = useGame();
  // Format timeElapsed to HH:MM:SS
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  const formattedTimeElapsed = formatTime(timeElapsed);
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-base text-white/75">Time Elapsed</p>
        <h2 className="text-xl text-primary">{formattedTimeElapsed}</h2>
      </div>
    </div>
  );
};

export default GameControls;
