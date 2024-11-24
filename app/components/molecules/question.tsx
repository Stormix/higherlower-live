import { useAuthQuery } from "@/lib/client/auth.query";
import { cn, getLoserMessage } from "@/lib/utils";
import type { Option as OptionType } from "@/types/socket";
import { useMemo, useState } from "react";
import { IoPlayOutline } from "react-icons/io5";
import Button from "../atoms/button";
import { useGame } from "../organisms/providers/game";
interface QuestionBubbleProps {
  question: string;
  className?: string;
}

interface QuestionOptionsProps {
  options: OptionType[];
  className?: string;
  winner?: "red" | "blue";
}

interface QuestionProps {
  // TODO: add props
  className?: string;
}

interface OptionProps {
  option: OptionType | undefined;
  className?: string;
  color: "red" | "blue";
  winner?: "red" | "blue";
}

interface OptionImageProps {
  className?: string;
  option: OptionType | undefined;
  winner?: "red" | "blue";
  color: "red" | "blue";
}

const QuestionBubble = ({ question, className }: QuestionBubbleProps) => {
  return (
    <div
      className={cn(
        "absolute flex flex-col items-center text-center justify-center bg-black px-8 py-4 z-20 top-[35%]",
        className,
      )}
    >
      <p className="text-sm">
        {question} <br /> (Vote <span className="text-blue">!1</span> or <span className="text-red">!2</span>)
      </p>
      <div className="invisible absolute top-14 h-2 w-2 bg-inherit before:visible before:absolute before:h-6 before:w-6 before:rotate-45 before:bg-inherit before:content-['']" />
    </div>
  );
};

const Option = ({ option, className, color, winner }: OptionProps) => {
  return (
    <div
      className={cn("flex justify-center flex-col", className, {
        "items-start": color === "red",
        "items-end": color === "blue",
      })}
    >
      <div
        className={cn(
          "flex flex-col justify-center px-8 h-14 text-md uppercase w-full to-transparent backdrop-blur-sm",
          {
            "bg-gradient-to-r from-red items-start": color === "red",
            "bg-gradient-to-l from-blue items-end": color === "blue",
            "from-muted": winner !== undefined && winner !== color,
          },
        )}
      >
        {option?.label ?? "Placeholder"}
      </div>
      <p
        className={cn("text-xs bg-gradient-to-r from-black to-transparent py-2 px-4", {
          "bg-gradient-to-l": color === "blue",
        })}
      >
        {option?.votes ?? 0} Voters
      </p>
    </div>
  );
};

const QuestionOptions = ({ options, className, winner }: QuestionOptionsProps) => {
  const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);
  const percentages = options.map((option) => (totalVotes > 0 ? Math.round((option.votes * 100) / totalVotes) : 0));

  return (
    <div className={cn("flex items-top justify-center absolute w-full z-10", className)}>
      <Option option={options?.[0]} color="blue" className="w-full" winner={winner} />

      <div className="flex items-center justify-center px-8 h-14 bg-black gap-8 text-sm relative">
        <p>{percentages[0]}%</p>
        <span className="uppercase text-xl">VS</span>
        <p>{percentages[1]}%</p>
        <div className="invisible absolute -right-3 h-6 w-6 bg-inherit before:visible before:absolute before:h-6 before:w-6 before:rotate-45 before:bg-inherit before:content-['']" />
        <div className="invisible absolute -left-3 h-6 w-6 bg-inherit before:visible before:absolute before:h-6 before:w-6 before:rotate-45 before:bg-inherit before:content-['']" />
      </div>

      <Option option={options[1]} color="red" className="w-full" winner={winner} />
    </div>
  );
};

const OptionImage = ({ className, option, winner, color }: OptionImageProps) => {
  return (
    <div
      className={cn("relative w-full transition-all duration-500 ease-linear", className, {
        "opacity-50 blur-sm grayscale h-[30%]": winner !== undefined && winner !== color,
        "h-[70%]": winner !== undefined && winner === color,
        "h-1/2": winner === undefined,
      })}
    >
      <img
        src={option?.image ?? "/images/top.png"}
        alt={option?.label ?? "Placeholder"}
        className={cn("object-cover w-full h-full")}
      />
      {winner !== undefined && (
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center to-transparent justify-center gap-4 transition-color ease-in-out duration-300",
            {
              "bg-gradient-to-b from-red/50 items-start": color === "red",
              "bg-gradient-to-t from-blue/50 items-end": color === "blue",
            },
          )}
        />
      )}
    </div>
  );
};

const Question = ({ className }: QuestionProps) => {
  const { answer, options, gameId, start, winner: winnerUsername } = useGame();
  const [firstGame, setFirstGame] = useState(true);
  const user = useAuthQuery();
  const winner = useMemo(() => {
    switch (answer) {
      case 0:
        return "blue";
      case 1:
        return "red";
      default:
        return undefined;
    }
  }, [answer]);

  const question = {
    question: "Which has more search results?",
    options: options ?? [],
  };

  return (
    <div className={cn("flex flex-col items-center h-full relative transition-all duration-500", className)}>
      <OptionImage option={question.options?.[0]} color="blue" winner={winner} />
      <OptionImage option={question.options?.[1]} color="red" winner={winner} />

      {winner === undefined && <QuestionBubble question={question.question} />}
      <QuestionOptions
        options={question.options}
        winner={winner}
        className={cn("-mt-6", {
          "top-[70%]": winner !== undefined && winner === "blue",
          "top-[30%]": winner !== undefined && winner === "red",
          "top-[50%]": winner === undefined,
        })}
      />

      {firstGame && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/75 z-30 backdrop-blur-lg flex flex-col items-center justify-center gap-4">
          <p className="text-center text-white text-2xl">Are you ready?</p>
          <Button
            icon={<IoPlayOutline size={24} />}
            onClick={() => {
              setFirstGame(false);
              start(user?.id!, gameId ?? undefined);
            }}
          >
            Start Game
          </Button>
        </div>
      )}

      {winner !== undefined && (
        <div className="absolute top-0 left-0 w-full h-full  z-30  flex flex-col items-center justify-center gap-4">
          <p className="text-center text-white">1st</p>
          <p className="text-center text-white text-2xl">{winnerUsername ?? getLoserMessage()}</p>
          <Button size="small" onClick={() => start(user?.id!, gameId ?? undefined)}>
            Next Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default Question;
