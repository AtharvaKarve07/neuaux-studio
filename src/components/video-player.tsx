"use client";

import { Pause, Play, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface VideoPlayerProps {
  src: string;
  poster: string;
  title: string;
  /** Start playing on mount. Only ever true when the user tapped this video's tile. */
  autoplay?: boolean;
}

/**
 * Plays only on a user action. The poster sits above the video and fades out once
 * the first frame is actually playing, so there is no flash between the two.
 */
export function VideoPlayer({ src, poster, title, autoplay = false }: VideoPlayerProps) {
  const t = useTranslations("viewer");
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    // Browsers may refuse playback that does not follow a gesture; the play button stays as the fallback.
    video.current?.play().catch(() => undefined);
  }, [autoplay]);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) element.play().catch(() => undefined);
    else element.pause();
  };

  const seek = (value: number) => {
    const element = video.current;
    if (!element || !Number.isFinite(element.duration)) return;
    element.currentTime = (value / 1000) * element.duration;
    setProgress(value);
  };

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={video}
        src={src}
        muted={muted}
        playsInline
        preload="metadata"
        aria-label={title}
        className="size-full object-contain"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPlaying={() => setStarted(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => {
          const element = event.currentTarget;
          if (Number.isFinite(element.duration) && element.duration > 0) {
            setProgress((element.currentTime / element.duration) * 1000);
          }
        }}
      />

      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 768px) 90vw, 100vw"
        draggable={false}
        onClick={toggle}
        className={cn(
          "select-none object-cover transition-opacity duration-200 ease-out",
          started ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      />

      {!playing ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid size-16 place-items-center bg-accent text-black">
            <Play size={28} weight="fill" aria-hidden />
          </span>
        </div>
      ) : null}

      <div data-no-pan className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-black/70 pl-1 pr-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t("pause") : t("play")}
          className="grid size-11 shrink-0 place-items-center text-fg transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          {playing ? <Pause size={22} weight="light" aria-hidden /> : <Play size={22} weight="light" aria-hidden />}
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={Math.round(progress)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label={t("seek")}
          className="scrub min-w-0 flex-1"
          style={{ "--progress": `${progress / 10}%` } as CSSProperties}
        />
        <button
          type="button"
          onClick={() => setMuted((value) => !value)}
          aria-label={muted ? t("unmute") : t("mute")}
          className="grid size-11 shrink-0 place-items-center text-fg transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          {muted ? (
            <SpeakerSlash size={22} weight="light" aria-hidden />
          ) : (
            <SpeakerHigh size={22} weight="light" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
