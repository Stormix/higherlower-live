import { cn } from "@/lib/utils";
import GameControls from "../atoms/game-controls";
import Chat from "../molecules/chat";

const RightSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col h-full gap-4", className)}>
      <GameControls />
      <Chat className="flex-grow overflow-y-scroll" />
    </div>
  );
};

export default RightSidebar;
