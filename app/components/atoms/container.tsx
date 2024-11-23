import { cn } from "@/lib/utils";

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("border-border border-2 rounded-md", className)}>{children}</div>;
};

export default Container;
