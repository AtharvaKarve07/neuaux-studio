"use client";

import { Play } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { workItems, type WorkItem } from "@/content/work";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { useViewer } from "@/store/viewer";
import { FadeImage } from "./fade-image";

interface WorkGridProps {
  items: readonly WorkItem[];
  /** How many of the first tiles load eagerly (the ones above the fold). */
  priorityCount?: number;
  /** "compact" keeps three columns at most (used for the six-tile home teaser). */
  density?: "full" | "compact";
  className?: string;
}

/** Mixed photo and video collage. Balanced columns keep every tile at its own aspect ratio. */
export function WorkGrid({ items, priorityCount = 0, density = "full", className }: WorkGridProps) {
  return (
    <ul
      className={cn(
        "columns-2 gap-2 md:columns-3 md:gap-3",
        density === "full" && "xl:columns-4",
        className,
      )}
    >
      {items.map((item, order) => (
        <Tile key={item.id} item={item} order={order} priority={order < priorityCount} />
      ))}
    </ul>
  );
}

function Tile({ item, order, priority }: { item: WorkItem; order: number; priority: boolean }) {
  const t = useTranslations("viewer");
  const reduce = useReducedMotion();
  const openAt = useViewer((state) => state.openAt);
  const hidden = useViewer((state) => state.hiddenTileId === item.id);
  const title = t(`titles.${item.id}`);
  const globalIndex = workItems.findIndex((entry) => entry.id === item.id);

  return (
    <motion.li
      className="mb-2 break-inside-avoid md:mb-3"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: order < 6 ? order * 0.04 : 0 }}
    >
      <button
        type="button"
        aria-label={t("open", { title })}
        className="relative block w-full text-left"
        onClick={(event) => {
          const media = event.currentTarget.querySelector<HTMLElement>("[data-work-tile]");
          const rect = media?.getBoundingClientRect();
          openAt(globalIndex, {
            autoplay: item.kind === "video",
            rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : undefined,
            thumb: media?.querySelector("img")?.currentSrc,
          });
        }}
      >
        <div
          data-work-tile={item.id}
          className={cn("relative w-full overflow-hidden bg-white/[0.04]", hidden && "invisible")}
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
        >
          <FadeImage
            src={item.src}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
          {item.kind === "video" ? (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-12 place-items-center border border-white/40 bg-black/55 text-fg">
                <Play size={22} weight="light" aria-hidden />
              </span>
            </span>
          ) : null}
        </div>
      </button>
    </motion.li>
  );
}
