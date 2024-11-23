import Container from "@/components/atoms/container";
import { cn } from "@/lib/utils";

const Card = ({
  children,
  className,
  header,
  stickyHeader = false,
}: { children: React.ReactNode; className?: string; header?: React.ReactNode; stickyHeader?: boolean }) => {
  return (
    <Container className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn("bg-border uppercase flex items-center py-4 px-8 justify-center gap-2", {
          "sticky top-0": stickyHeader,
        })}
      >
        {header}
      </div>
      <div className="p-4">{children}</div>
    </Container>
  );
};

export default Card;
