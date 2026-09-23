import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bezel } from "@/components/bezel";
import { ButtonLink } from "@/components/button";
import { CtaBand } from "@/components/cta-band";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { Heading, Section } from "@/components/section";
import { WorkGrid } from "@/components/work-grid";
import { site } from "@/content/site";
import { homeWorkIds, workItems, type WorkItem } from "@/content/work";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("title") },
    alternates: alternatesFor(locale, ""),
    openGraph: { url: `${site.url}/${locale}`, title: t("title") },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const featured = homeWorkIds
    .map((id) => workItems.find((item) => item.id === id))
    .filter((item): item is WorkItem => Boolean(item));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: `${site.url}/${locale}`,
    email: site.email,
    sameAs: [site.instagram.url],
    address: { "@type": "PostalAddress", addressLocality: "Warsaw", addressCountry: "PL" },
    areaServed: "Warsaw",
    serviceType: ["Photography", "Video production"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />

      <Section labelledBy="home-work">
        <Reveal>
          <Heading id="home-work">{t("work.title")}</Heading>
        </Reveal>
        <div className="mt-10 md:mt-14">
          <WorkGrid items={featured} priorityCount={2} density="compact" />
        </div>
        <Reveal className="mt-10 md:mt-14">
          <ButtonLink href="/work" variant="secondary">
            {t("hero.seeWork")}
          </ButtonLink>
        </Reveal>
      </Section>

      <Section labelledBy="home-services" className="pt-0 md:pt-0">
        <Reveal>
          <Heading id="home-services">{t("services.title")}</Heading>
        </Reveal>
        <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <Bezel className="h-full" innerClassName="flex h-full min-h-[16rem] flex-col justify-between gap-12 p-6 md:min-h-[22rem] md:p-10">
              <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.035em]">
                {t("services.video.title")}
              </h3>
              <p className="max-w-md leading-relaxed text-mute">{t("services.video.text")}</p>
            </Bezel>
          </Reveal>
          <Reveal className="md:col-span-5 md:mt-20" delay={0.08}>
            <Bezel className="h-full" innerClassName="flex h-full min-h-[16rem] flex-col justify-between gap-12 p-6 md:min-h-[18rem] md:p-10">
              <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.035em]">
                {t("services.photo.title")}
              </h3>
              <p className="max-w-md leading-relaxed text-mute">{t("services.photo.text")}</p>
            </Bezel>
          </Reveal>
        </div>
        <Reveal className="mt-10 md:mt-14">
          <ButtonLink href="/services" variant="secondary">
            {t("services.more")}
          </ButtonLink>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
