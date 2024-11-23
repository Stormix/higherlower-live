import Container from "@/components/atoms/container";
import { cn } from "@/lib/utils";

const Card = ({
  children,
  className,
  header,
}: { children: React.ReactNode; className?: string; header?: React.ReactNode }) => {
  return (
    <Container className={cn("flex flex-col gap-2", className)}>
      <div className="bg-border uppercase flex items-center py-4 px-8 justify-center">{header}</div>
      <div className="p-4">{children}</div>
    </Container>
  );
};

export default Card;
