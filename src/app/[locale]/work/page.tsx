import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { Heading, shell } from "@/components/section";
import { WorkGrid } from "@/components/work-grid";
import { workItems } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/work", "work");
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");

  return (
    <>
      <section aria-labelledby="work-title" className="px-4 pb-24 pt-32 md:px-8 md:pb-32 md:pt-44">
        <div className={shell}>
          <Reveal>
            <Heading as="h1" id="work-title">
              {t("title")}
            </Heading>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-mute">{t("text")}</p>
          </Reveal>
          <div className="mt-12 md:mt-16">
            <WorkGrid items={workItems} priorityCount={4} />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
