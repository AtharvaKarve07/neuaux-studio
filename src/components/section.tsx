import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Horizontal page frame shared by every section. */
export const shell = "mx-auto w-full max-w-[1400px]";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}

/** Generous vertical rhythm. The section owns the page gutter. */
export function Section({ children, className, id, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("px-4 py-24 md:px-8 md:py-32", className)}>
      <div className={shell}>{children}</div>
    </section>
  );
}

interface HeadingProps {
  children: ReactNode;
  id?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

const sizes = {
  h1: "text-[clamp(2.1rem,7vw,4.25rem)] leading-[1.04] tracking-[-0.04em]",
  h2: "text-[clamp(1.65rem,4.6vw,3rem)] leading-[1.08] tracking-[-0.035em]",
  h3: "text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.15] tracking-[-0.025em]",
} as const;

export function Heading({ children, id, as: Tag = "h2", className }: HeadingProps) {
  return (
    <Tag id={id} className={cn("font-display font-medium text-fg", sizes[Tag], className)}>
      {children}
    </Tag>
  );
}
