import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bezel } from "@/components/bezel";
import { CtaBand } from "@/components/cta-band";
import { FadeImage } from "@/components/fade-image";
import { Reveal } from "@/components/reveal";
import { Heading, Section, shell } from "@/components/section";
import { team } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/about", "about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <section aria-labelledby="about-title" className="px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-44">
        <div className={shell}>
          <Reveal>
            <Heading as="h1" id="about-title">
              {t("title")}
            </Heading>
          </Reveal>
          <Reveal className="mt-10 md:mt-14" delay={0.06}>
            <p className="max-w-4xl font-display text-[clamp(1.35rem,3.2vw,2.5rem)] font-medium leading-[1.2] tracking-[-0.03em]">
              {t("lead")}
            </p>
          </Reveal>
          <Reveal className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-12" delay={0.1}>
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-mute">{t("p1")}</p>
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-mute">{t("p2")}</p>
          </Reveal>
        </div>
      </section>

      {/*
        A plain wrapping grid: it looks right whether the studio lists one person or several,
        so nothing here needs to change when someone joins or leaves. The alternating offset
        on tablet and up is just rhythm, not a layout tied to a specific headcount.
      */}
      <Section className="pt-0 md:pt-0" labelledBy="team">
        <Reveal>
          <Heading id="team">{t("teamTitle")}</Heading>
        </Reveal>
        <ul className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-14 md:gap-12 lg:grid-cols-3">
          {team.map((person, position) => {
            const role = person.role[locale as keyof typeof person.role] ?? person.role.en;
            return (
              <li key={person.id} className={position % 2 === 1 ? "sm:mt-14" : undefined}>
                <Reveal delay={Math.min(position, 4) * 0.06}>
                  <Bezel>
                    <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.04]">
                      <FadeImage
                        src={person.photo}
                        alt={person.name}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Bezel>
                  <p className="mt-5 font-display text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium leading-[1.15] tracking-[-0.025em]">
                    {person.name}
                  </p>
                  <p className="mt-1 text-mute">{role}</p>
                  {person.placeholder ? <p className="mt-1 text-xs text-mute">{t("photoNote")}</p> : null}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
