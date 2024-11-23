import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  stickyHeader?: boolean;
}

const Section = ({ title, children, className, stickyHeader = false }: SectionProps) => (
  <section className={cn("border-2  border-border flex flex-col", className)}>
    <div
      className={cn("flex items-center gap-4 px-5 py-4 text-sm text-white uppercase bg-border", {
        "sticky top-0": stickyHeader,
      })}
    >
      {title}
    </div>
    {children}
  </section>
);

export default Section;
