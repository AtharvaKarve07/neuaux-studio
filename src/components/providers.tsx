"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useUi } from "@/store/ui";
import { useViewer } from "@/store/viewer";
import { WorkViewer } from "./work-viewer";

/** Pauses smooth scrolling while the menu or the viewer holds the screen. */
function LenisGate() {
  const lenis = useLenis();
  const menuOpen = useUi((state) => state.menuOpen);
  const viewerMounted = useViewer((state) => state.mounted);

  useEffect(() => {
    if (!lenis) return;
    if (menuOpen || viewerMounted) lenis.stop();
    else lenis.start();
  }, [lenis, menuOpen, viewerMounted]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{ autoRaf: true, lerp: 0.11, smoothWheel: !reduce, syncTouch: false, anchors: true }}
      >
        <LenisGate />
        {children}
        <WorkViewer />
        <Toaster theme="dark" position="bottom-center" offset={16} />
      </ReactLenis>
    </MotionConfig>
  );
}
