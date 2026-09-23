"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * next/image that fades in once decoded, so images never pop into a finished layout.
 * The ref check covers images that finished loading before hydration.
 */
export function FadeImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <Image
      {...props}
      ref={ref}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn("transition-opacity duration-300 ease-out", loaded ? "opacity-100" : "opacity-0", className)}
    />
  );
}
