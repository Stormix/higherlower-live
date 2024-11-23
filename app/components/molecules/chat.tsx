import { useChatStore } from "@/lib/client/store/chat";
import type { TwitchMessage } from "@/types/twitch";
import { useEffect, useMemo, useRef } from "react";
import { BsChatLeftFill } from "react-icons/bs";
import Markdown from "react-markdown";
import Section from "../atoms/section";

const Message = ({ message, username, color }: TwitchMessage) => {
  const textColor = useMemo(() => {
    const c = color?.replace("#", "") ?? "000000";
    const r = Number.parseInt(c.substring(0, 2), 16);
    const g = Number.parseInt(c.substring(2, 4), 16);
    const b = Number.parseInt(c.substring(4, 6), 16);

    // Counting the perceptive luminance - human eye favors green color...
    const a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return a < 0.5 ? "black" : "white";
  }, [color]);

  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex items-center gap-2">
        <div
          className="px-2 py-[3px] font-semibold rounded text-[10px]"
          style={{ backgroundColor: color, color: textColor }}
        >
          {username}
        </div>
      </div>
      <div className="font-display text-[16px] bg-border/25 p-3 rounded overflow-hidden break-all">
        <Markdown className={"text-wrap w-full"}>{message}</Markdown>
      </div>
    </div>
  );
};

interface ChatProps {
  className?: string;
}

const Chat = ({ className }: ChatProps) => {
  const { messages } = useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: biome dumb
  useEffect(() => {
    scrollRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Section
      className={className}
      title={
        <>
          <BsChatLeftFill className="w-6 h-6" />
          <span>Chat</span>
        </>
      }
      stickyHeader
    >
      <div className="flex flex-col items-start justify-end gap-4 p-4" ref={scrollRef}>
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
      </div>
    </Section>
  );
};

export default Chat;
