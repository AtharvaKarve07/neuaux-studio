"use client";

import { useLocale } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";

/** Module scope survives client-side navigation but not a hard load. */
let lastLocale: string | null = null;

/**
 * Softens a language switch: the page body fades in over 260ms instead of swapping in a single frame.
 * Nothing runs on a first visit or a normal page change.
 */
export function LocaleTransition({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [switched] = useState(() => lastLocale !== null && lastLocale !== locale);

  useEffect(() => {
    lastLocale = locale;
  }, [locale]);

  return <div className={switched ? "locale-in" : undefined}>{children}</div>;
}
