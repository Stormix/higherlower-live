import { IoPlayOutline } from "react-icons/io5";
import { LuPause } from "react-icons/lu";
import Button from "./button";

const GameControls = () => {
  const start = () => {};
  const stop = () => {};
  const started = false;

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-base text-white/75">Time Elapsed</p>
        <h2 className="text-xl text-primary">00:13:50</h2>
      </div>
      <Button
        className="w-full"
        onClick={() => (started ? stop() : start())}
        icon={!started ? <IoPlayOutline size={24} /> : <LuPause size={24} />}
      >
        {!started ? "Start" : "Pause"} Game
      </Button>
    </div>
  );
};

export default GameControls;
