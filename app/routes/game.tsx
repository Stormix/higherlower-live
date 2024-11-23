import Navbar from "@/components/atoms/navbar";
import Question from "@/components/molecules/question";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/molecules/resizable";
import LeftSidebar from "@/components/organisms/left-sidebar";
import { GameProvider } from "@/components/organisms/providers/game";
import { useWebSocket } from "@/components/organisms/providers/ws";
import RightSidebar from "@/components/organisms/right-sidebar";
import { useAuthQuery } from "@/lib/client/auth.query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/game")({
  beforeLoad: async ({ context }) => {
    if (!context.auth) {
      toast.error("You must be logged in to access this page");
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { connect, isConnected, connectedChannel } = useWebSocket();
  const { data: auth } = useAuthQuery();
  const channel = auth?.user?.name;

  useEffect(() => {
    if (isConnected && !connectedChannel && channel) {
      console.info("Connecting to channel", channel);
      connect(channel);
    }
  }, [connect, isConnected, connectedChannel, channel]);

  return (
    <GameProvider>
      <main className="flex h-screen overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>
            <LeftSidebar className="h-full" />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} className="flex flex-col h-full gap-4 py-4 px-4">
            <Navbar />
            <Question className="flex-grow" />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20}>
            <RightSidebar className="h-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </GameProvider>
  );
}
