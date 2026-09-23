import { getTranslations } from "next-intl/server";
import { ButtonLink } from "./button";
import { Reveal } from "./reveal";
import { Heading, shell } from "./section";
import { cn } from "@/lib/cn";

/** Closing call to action. One label for one intent: "Book a call" everywhere. */
export async function CtaBand() {
  const t = await getTranslations("home.cta");
  const tn = await getTranslations("nav");

  return (
    <section aria-labelledby="cta-title" className="border-t border-line px-4 py-24 md:px-8 md:py-36">
      <div className={cn(shell, "grid gap-10 md:grid-cols-12 md:items-end")}>
        <Reveal className="md:col-span-8">
          <Heading id="cta-title" className="text-[clamp(1.85rem,5.2vw,3.75rem)] leading-[1.06] tracking-[-0.04em]">
            {t("title")}
          </Heading>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-mute">{t("text")}</p>
        </Reveal>
        <Reveal className="md:col-span-4 md:justify-self-end" delay={0.08}>
          <ButtonLink href="/contact">{tn("book")}</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
