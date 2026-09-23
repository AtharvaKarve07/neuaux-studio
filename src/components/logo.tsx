import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo-path";

interface LogoProps {
  className?: string;
  /** Accessible name. Leave out when the logo sits next to visible text or inside a labelled link. */
  title?: string;
}

/** The studio monogram, traced from the supplied logo file. Inherits the text color. */
export function Logo({ className, title }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
