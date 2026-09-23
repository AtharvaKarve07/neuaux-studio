"use client";

import { Dialog } from "@base-ui/react/dialog";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  usePresence,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { workItems, type WorkItem } from "@/content/work";
import {
  DISMISS_DISTANCE,
  DISMISS_VELOCITY,
  EASE_OUT,
  SPRING_SETTLE,
  SPRING_SHARED,
  SPRING_SNAP,
  SWIPE_DISTANCE,
  SWIPE_VELOCITY,
} from "@/lib/motion";
import { useViewer } from "@/store/viewer";
import { VideoPlayer } from "./video-player";

const SPRING_EXIT = { type: "spring", duration: 0.45, bounce: 0 } as const;

/** Friction beyond an edge: the further you pull, the less it moves. */
function resist(distance: number) {
  return (distance * 0.35) / (1 + Math.abs(distance) / 420);
}

export function WorkViewer() {
  const mounted = useViewer((state) => state.mounted);
  const open = useViewer((state) => state.open);
  const close = useViewer((state) => state.close);
  const unmount = useViewer((state) => state.unmount);
  const closeButton = useRef<HTMLButtonElement>(null);

  return (
    <Dialog.Root
      open={mounted}
      modal
      onOpenChange={(next) => {
        // Escape and outside presses land here. The exit animation decides when the dialog really unmounts.
        if (!next) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 z-[var(--z-viewer)] outline-none" initialFocus={closeButton}>
          <Stage open={open} closeButton={closeButton} onExitComplete={unmount} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface StageProps {
  open: boolean;
  closeButton: React.RefObject<HTMLButtonElement | null>;
  onExitComplete: () => void;
}

function Stage({ open, closeButton, onExitComplete }: StageProps) {
  const t = useTranslations("viewer");
  const tc = useTranslations("categories");
  const tk = useTranslations("kinds");
  const index = useViewer((state) => state.index);
  const close = useViewer((state) => state.close);
  const goTo = useViewer((state) => state.goTo);
  const item = workItems[index];
  const dim = useMotionValue(0);
  const scrimOpacity = useTransform(dim, (value) => 1 - value);

  // Arrow keys move instantly: keyboard actions are repeated, so they get no animation.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT") return;
      if (event.key === "ArrowRight") goTo(index + 1, 0);
      if (event.key === "ArrowLeft") goTo(index - 1, 0);
    };
    // Capture phase: the dialog primitive stops keydown from bubbling out of its popup.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, index, goTo]);

  const title = t(`titles.${item.id}`);
  const meta = `${tc(item.category)}, ${tk(item.kind)}`;

  return (
    <>
      <Dialog.Title className="sr-only">{title}</Dialog.Title>
      <Dialog.Description className="sr-only">{t("label")}</Dialog.Description>

      <AnimatePresence onExitComplete={onExitComplete}>
        {open ? (
          <motion.div
            key="scrim"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            onClick={close}
          >
            <motion.div className="size-full bg-black" style={{ opacity: scrimOpacity }} />
          </motion.div>
        ) : null}

        {open ? (
          <motion.div
            key="chrome"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6 md:pt-6">
              <div className="min-w-0 pt-1">
                <p className="truncate text-sm font-medium text-fg">{meta}</p>
                {item.placeholder ? <p className="mt-0.5 text-xs text-mute">{t("sample")}</p> : null}
              </div>
              <Dialog.Close
                ref={closeButton}
                aria-label={t("close")}
                className="pointer-events-auto grid size-11 shrink-0 place-items-center border border-line-strong bg-black/60 text-fg transition-[transform,border-color] duration-150 ease-out active:scale-[0.94] hover:border-fg"
              >
                <X size={22} weight="light" aria-hidden />
              </Dialog.Close>
            </div>

            <div className="absolute inset-x-0 bottom-0 hidden items-center justify-center gap-2 pb-6 md:flex">
              <NavButton direction={-1} label={t("previous")} disabled={index === 0} />
              <NavButton direction={1} label={t("next")} disabled={index === workItems.length - 1} />
            </div>
          </motion.div>
        ) : null}

        {open ? <Slide key={item.id} item={item} title={title} dim={dim} /> : null}
      </AnimatePresence>
    </>
  );
}

function NavButton({ direction, label, disabled }: { direction: 1 | -1; label: string; disabled: boolean }) {
  const index = useViewer((state) => state.index);
  const goTo = useViewer((state) => state.goTo);
  const Icon = direction === 1 ? CaretRight : CaretLeft;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => goTo(index + direction, direction)}
      className="pointer-events-auto grid size-12 place-items-center border border-line-strong bg-black/60 text-fg transition-[transform,border-color,opacity] duration-150 ease-out active:scale-[0.94] enabled:hover:border-fg disabled:opacity-30"
    >
      <Icon size={22} weight="light" aria-hidden />
    </button>
  );
}

interface SlideProps {
  item: WorkItem;
  title: string;
  dim: MotionValue<number>;
}

/**
 * One media slide. Motion is imperative on purpose: opening grows out of the tile, closing
 * flies back to it (or fades if the tile is off screen), swipes hand the finger's velocity
 * to a spring, and every value animates from where it currently is, so any of it can be
 * interrupted mid-flight.
 */
function Slide({ item, title, dim }: SlideProps) {
  const reduce = useReducedMotion();
  const [isPresent, safeToRemove] = usePresence();
  const container = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);

  const itemIndex = workItems.findIndex((entry) => entry.id === item.id);
  const hasPrev = itemIndex > 0;
  const hasNext = itemIndex < workItems.length - 1;

  const [entry] = useState(() => {
    const state = useViewer.getState();
    const firstOpen = !state.navigated && workItems[state.index]?.id === item.id;
    return { firstOpen, thumb: firstOpen ? state.originThumb : null, autoplay: firstOpen && state.autoplay };
  });

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const flipX = useMotionValue(0);
  const flipY = useMotionValue(0);
  const flipScale = useMotionValue(1);
  const opacity = useMotionValue(1);
  const axis = useRef<"x" | "y" | "none" | null>(null);
  const panned = useRef(false);

  // Enter: grow out of the tile on first open, slide in after a swipe, otherwise appear instantly.
  useLayoutEffect(() => {
    const box = media.current;
    if (!box) return;
    flipX.jump(0);
    flipY.jump(0);
    flipScale.jump(1);
    const state = useViewer.getState();
    const running: Array<{ stop: () => void }> = [];

    if (entry.firstOpen) {
      const from = state.originRect;
      if (from && !reduce) {
        const to = box.getBoundingClientRect();
        flipX.set(from.left - to.left);
        flipY.set(from.top - to.top);
        flipScale.set(from.width / to.width);
        running.push(animate(flipX, 0, SPRING_SHARED), animate(flipY, 0, SPRING_SHARED), animate(flipScale, 1, SPRING_SHARED));
      } else {
        opacity.set(0);
        running.push(animate(opacity, 1, { duration: 0.2, ease: EASE_OUT }));
      }
    } else if (state.direction !== 0) {
      if (reduce) {
        opacity.set(0);
        running.push(animate(opacity, 1, { duration: 0.2, ease: EASE_OUT }));
      } else {
        const width = container.current?.clientWidth ?? 320;
        panX.set(state.direction * width * 0.18);
        opacity.set(0);
        running.push(animate(panX, 0, SPRING_SETTLE), animate(opacity, 1, { duration: 0.2, ease: EASE_OUT }));
      }
    }
    return () => running.forEach((controls) => controls.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Exit: fly back to the tile when closing, slide out sideways when swiping to another item.
  useEffect(() => {
    if (isPresent) return;
    const state = useViewer.getState();
    const box = media.current;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      if (!state.open && !useViewer.getState().open) useViewer.setState({ hiddenTileId: null });
      safeToRemove?.();
    };

    if (!state.open) {
      const tile = document.querySelector<HTMLElement>(`[data-work-tile="${item.id}"]`);
      const target = tile?.getBoundingClientRect();
      const visible =
        target &&
        target.width > 0 &&
        target.bottom > 0 &&
        target.top < window.innerHeight &&
        target.right > 0 &&
        target.left < window.innerWidth;

      if (box && target && visible && !reduce) {
        const current = box.getBoundingClientRect();
        const animations = [
          animate(flipX, flipX.get() + (target.left - current.left), SPRING_EXIT),
          animate(flipY, flipY.get() + (target.top - current.top), SPRING_EXIT),
          animate(flipScale, flipScale.get() * (target.width / current.width), SPRING_EXIT),
        ];
        Promise.all(animations).then(finish);
        return () => {
          cancelled = true;
          animations.forEach((controls) => controls.stop());
        };
      }

      const fade = animate(opacity, 0, { duration: 0.2, ease: EASE_OUT });
      Promise.resolve(fade).then(finish);
      return () => {
        cancelled = true;
        fade.stop();
      };
    }

    // Swiped to another item (the store already points at it).
    const direction = state.direction;
    if (direction === 0) {
      finish();
      return;
    }
    const width = container.current?.clientWidth ?? 320;
    const animations = reduce
      ? [animate(opacity, 0, { duration: 0.15, ease: EASE_OUT })]
      : [animate(panX, -direction * width * 0.18, SPRING_SETTLE), animate(opacity, 0, { duration: 0.15, ease: EASE_OUT })];
    Promise.all(animations).then(finish);
    return () => {
      cancelled = true;
      animations.forEach((controls) => controls.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  const snapBack = useCallback(() => {
    animate(panX, 0, SPRING_SNAP);
    animate(panY, 0, SPRING_SNAP);
    animate(dim, 0, { duration: 0.2, ease: EASE_OUT });
  }, [panX, panY, dim]);

  const onPanStart = (event: PointerEvent | MouseEvent | TouchEvent) => {
    panned.current = false;
    const target = event.target as HTMLElement | null;
    axis.current = target?.closest("[data-no-pan]") ? "none" : null;
  };

  const onPan = (_: unknown, info: PanInfo) => {
    if (axis.current === "none") return;
    if (!axis.current) {
      if (Math.hypot(info.offset.x, info.offset.y) < 8) return;
      axis.current = Math.abs(info.offset.x) > Math.abs(info.offset.y) ? "x" : "y";
    }
    panned.current = true;
    if (axis.current === "x") {
      const dx = info.offset.x;
      const blocked = (dx > 0 && !hasPrev) || (dx < 0 && !hasNext);
      panX.set(blocked ? resist(dx) : dx);
      panY.set(0);
    } else {
      const dy = info.offset.y;
      panY.set(dy > 0 ? dy : resist(dy));
      panX.set(0);
      dim.set(Math.min(Math.max(dy, 0) / 480, 0.55));
    }
  };

  const onPanEnd = (_: unknown, info: PanInfo) => {
    const mode = axis.current;
    axis.current = null;
    if (!mode || mode === "none") return;

    if (mode === "y") {
      if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY) {
        useViewer.getState().close();
      } else {
        snapBack();
      }
      return;
    }

    const width = container.current?.clientWidth ?? 320;
    const fast = Math.abs(info.velocity.x) > SWIPE_VELOCITY;
    const far = Math.abs(info.offset.x) > width * SWIPE_DISTANCE;
    if (fast || far) {
      const sign = fast ? Math.sign(info.velocity.x) : Math.sign(info.offset.x);
      const state = useViewer.getState();
      if (sign < 0 && hasNext) {
        state.goTo(state.index + 1, 1);
        return;
      }
      if (sign > 0 && hasPrev) {
        state.goTo(state.index - 1, -1);
        return;
      }
    }
    snapBack();
  };

  const ratio = item.width / item.height;

  return (
    <motion.div
      ref={container}
      className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] top-[calc(env(safe-area-inset-top)+4.5rem)] grid place-items-center [container-type:size] md:inset-x-20 md:bottom-24 md:top-24"
      style={{ opacity }}
      onClick={(event) => {
        if (event.target === event.currentTarget) useViewer.getState().close();
      }}
    >
      <motion.div
        className="touch-none"
        style={{ x: panX, y: panY, touchAction: "none" }}
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        onClickCapture={(event) => {
          if (panned.current) {
            event.stopPropagation();
            event.preventDefault();
            panned.current = false;
          }
        }}
      >
        <motion.div
          ref={media}
          className="relative overflow-hidden bg-white/[0.04]"
          style={{
            x: flipX,
            y: flipY,
            scale: flipScale,
            transformOrigin: "0 0",
            width: `min(100cqw, calc(100cqh * ${ratio}))`,
            aspectRatio: ratio,
          }}
        >
          {item.kind === "video" && item.video ? (
            <VideoPlayer src={item.video.src} poster={item.src} title={title} autoplay={entry.autoplay} />
          ) : (
            <>
              {entry.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.thumb} alt="" draggable={false} className="absolute inset-0 size-full select-none object-cover" />
              ) : null}
              <Image
                src={item.src}
                alt={title}
                fill
                priority
                quality={82}
                sizes="(min-width: 768px) 90vw, 100vw"
                draggable={false}
                className="select-none object-cover"
              />
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
