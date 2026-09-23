import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Shape rule: sharp corners everywhere. The trailing arrow sits in its own square,
 * flush with the button's right padding, and shifts diagonally on hover.
 */
export const buttonStyles = cva(
  "group relative inline-flex min-h-12 select-none items-center justify-center gap-3 whitespace-nowrap font-sans text-[0.9375rem] font-medium leading-none transition-[transform,background-color,color,border-color,opacity] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-accent pl-6 pr-1.5 text-black hover:bg-[#ee7238]",
        secondary: "border border-line-strong px-6 text-fg hover:border-fg",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type Variant = VariantProps<typeof buttonStyles>["variant"];

function Arrow({ variant }: { variant: Variant }) {
  if (variant === "secondary") return null;
  return (
    <span className="grid size-9 place-items-center bg-black/10 transition-transform duration-300 ease-drawer group-hover:-translate-y-px group-hover:translate-x-0.5">
      <ArrowUpRight size={18} weight="light" aria-hidden />
    </span>
  );
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className" | "children"> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonStyles({ variant }), className)} {...props}>
      <span>{children}</span>
      <Arrow variant={variant} />
    </Link>
  );
}

interface ButtonProps extends Omit<ComponentProps<"button">, "className" | "children"> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonStyles({ variant }), className)} {...props}>
      <span>{children}</span>
      <Arrow variant={variant} />
    </button>
  );
}
