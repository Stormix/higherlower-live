import { useLeaderboardQuery } from "@/lib/client/leaderboard.query";
import { cn } from "@/lib/utils";
import { BsChatLeftFill } from "react-icons/bs";
import { PiTwitchLogoFill } from "react-icons/pi";
import CameraPlaceholder from "../atoms/camera";
import Leaderboard from "../molecules/leaderboard";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../molecules/resizable";

interface LeftSidebarProps {
  className?: string;
}

const LeftSidebar = ({ className }: LeftSidebarProps) => {
  const { data } = useLeaderboardQuery();
  return (
    <div className={cn(className)}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={25} className="mb-4">
          <CameraPlaceholder />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="flex flex-col flex-1 gap-4">
          <Leaderboard
            title={
              <>
                <PiTwitchLogoFill className="w-6 h-6" />
                Streamers Leaderboard
              </>
            }
            players={data?.streamers.slice(0, 5) ?? []}
          />
          <Leaderboard
            className="flex-1"
            title={
              <>
                <BsChatLeftFill className="w-6 h-6" />
                Chat Leaderboard
              </>
            }
            players={data?.viewers.slice(0, 5) ?? []}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default LeftSidebar;
