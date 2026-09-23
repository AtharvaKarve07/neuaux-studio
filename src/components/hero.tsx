"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./button";
import { Logo } from "./logo";

/** Module scope survives client-side navigation, so the entrance plays once per visit. */
let heroPlayed = false;

const step = (index: number) => ({ "--i": index }) as CSSProperties;

export function Hero() {
  const t = useTranslations("home.hero");
  const tn = useTranslations("nav");
  const [played] = useState(heroPlayed);

  useEffect(() => {
    heroPlayed = true;
  }, []);

  return (
    <section
      className={cn(
        "relative isolate flex min-h-[100dvh] flex-col justify-end overflow-hidden px-4 pb-10 pt-24 md:px-8 md:pb-16",
        played && "hero-static",
      )}
    >
      {/* The logo is the hero visual: one large mark with rough, printed edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[16vw] top-[11dvh] -z-10 h-[40dvh] text-fg md:-right-[4vw] md:top-[11dvh] md:h-[44dvh] lg:h-[48dvh]"
        style={{ filter: "url(#logo-rough)" }}
      >
        <Logo className="h-full w-auto" />
      </div>
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="logo-rough" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="mx-auto w-full max-w-[1400px]">
        <h1 className="hero-in hero-title max-w-[19ch] font-display font-medium leading-[1.06] tracking-[-0.035em] text-fg md:max-w-[22ch]" style={step(0)}>
          {t("title")}
        </h1>
        <p className="hero-in mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-mute md:mt-6" style={step(1)}>
          {t("text")}
        </p>
        <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={step(2)}>
          <ButtonLink href="/contact">{tn("book")}</ButtonLink>
          <ButtonLink href="/work" variant="secondary">
            {t("seeWork")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
