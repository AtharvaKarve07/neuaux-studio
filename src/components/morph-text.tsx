"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { TextMorph } from "torph/react";

/**
 * Text that morphs between two strings when the language changes.
 *
 * The [locale] layout remounts on a language switch, so the previous string is remembered
 * in module scope per `id`. A fresh mount starts from that old string and updates to the new
 * one on the next frame, which is what triggers the morph. On a hard load nothing is
 * remembered, so the text renders as plain server HTML.
 */
const lastSeen = new Map<string, string>();

interface MorphTextProps {
  id: string;
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
}

export function MorphText({ id, children, as, className, duration = 420 }: MorphTextProps) {
  const previous = useRef(lastSeen.get(id));
  const [shown, setShown] = useState(previous.current ?? children);

  useEffect(() => {
    lastSeen.set(id, children);
    if (shown === children) return;
    const frame = requestAnimationFrame(() => setShown(children));
    return () => cancelAnimationFrame(frame);
  }, [id, children, shown]);

  return (
    <TextMorph as={as} className={className} duration={duration} ease="cubic-bezier(0.23, 1, 0.32, 1)">
      {shown}
    </TextMorph>
  );
}
