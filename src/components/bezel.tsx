import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BezelProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

/**
 * Nested enclosure: a hairline outer shell around an inner core with its own highlight.
 * Both layers are sharp, so the curves stay concentric (there are none).
 */
export function Bezel({ children, className, innerClassName }: BezelProps) {
  return (
    <div className={cn("border border-line bg-panel p-1.5", className)}>
      <div className={cn("bg-core shadow-[inset_0_1px_0_rgb(255_255_255/0.07)]", innerClassName)}>{children}</div>
    </div>
  );
}
