import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "bg-border uppercase flex items-center gap-2 transition-colors ease-in-out duration-200 rounded-md text-xs cursor-pointer",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-border text-white", "border-transparent", "hover:bg-blue-600"],
        twitch: ["bg-twitch", "text-white", "border-twitch-dark", "hover:bg-twitch-dark"],
      },
      size: {
        small: ["py-1", "px-2"],
        medium: ["py-4", "px-4"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends Omit<ButtonVariantProps, "required"> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({ children, className, icon = null, type = "button", intent, size, onClick }: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ intent, size, className }))} type={type} onClick={() => onClick?.()}>
      {icon}
      {children}
    </button>
  );
};

export default Button;
