import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Bezel } from "@/components/bezel";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { Heading, Section, shell } from "@/components/section";
import type { Category } from "@/content/work";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/services", "services");
}

interface Job {
  key: Category;
  span: string;
  image?: { src: string; width: number; height: number };
}

/** Asymmetric 6-column bento. Three cells carry a photo, three stay flat. */
const JOBS: readonly Job[] = [
  { key: "realEstate", span: "md:col-span-4", image: { src: "/work/real-3.jpg", width: 1600, height: 1067 } },
  { key: "events", span: "md:col-span-2" },
  { key: "portraits", span: "md:col-span-3" },
  { key: "creative", span: "md:col-span-3", image: { src: "/work/port5.webp", width: 1400, height: 1400 } },
  { key: "food", span: "md:col-span-2", image: { src: "/work/food-4.jpg", width: 1500, height: 1000 } },
  { key: "street", span: "md:col-span-4" },
];

const STEPS = ["brief", "plan", "shoot", "deliver"] as const;

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tc = await getTranslations("categories");

  return (
    <>
      <section aria-labelledby="services-title" className="px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-44">
        <div className={shell}>
          <Reveal>
            <Heading as="h1" id="services-title">
              {t("title")}
            </Heading>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-mute">{t("text")}</p>
          </Reveal>
        </div>
      </section>

      <Section className="pt-0 md:pt-0" labelledBy="crafts">
        <h2 id="crafts" className="sr-only">
          {t("video.title")}, {t("photo.title")}
        </h2>
        <div className="flex flex-col gap-3">
          <Reveal>
            <Bezel innerClassName="grid gap-8 p-6 md:grid-cols-12 md:gap-12 md:p-12">
              <Heading as="h3" className="md:col-span-5 text-[clamp(1.6rem,3.6vw,2.75rem)]">
                {t("video.title")}
              </Heading>
              <p className="max-w-xl leading-relaxed text-mute md:col-span-6 md:col-start-7">{t("video.text")}</p>
            </Bezel>
          </Reveal>
          <Reveal delay={0.06}>
            <Bezel innerClassName="grid gap-8 p-6 md:grid-cols-12 md:gap-12 md:p-12">
              <Heading as="h3" className="text-[clamp(1.6rem,3.6vw,2.75rem)] md:order-2 md:col-span-5 md:col-start-8 md:row-start-1">
                {t("photo.title")}
              </Heading>
              <p className="max-w-xl leading-relaxed text-mute md:order-1 md:col-span-6 md:col-start-1 md:row-start-1">
                {t("photo.text")}
              </p>
            </Bezel>
          </Reveal>
        </div>
      </Section>

      <Section className="pt-0 md:pt-0" labelledBy="jobs">
        <Reveal>
          <Heading id="jobs">{t("jobsTitle")}</Heading>
        </Reveal>
        <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-6">
          {JOBS.map((job, position) => (
            <li key={job.key} className={job.span}>
              <Reveal delay={Math.min(position, 3) * 0.05} className="h-full">
                <article
                  className={cn(
                    "relative isolate flex h-full min-h-[14rem] flex-col justify-end gap-3 overflow-hidden border border-line p-6 md:min-h-[17rem] md:p-8",
                    job.image ? "bg-black" : "bg-panel",
                  )}
                >
                  {job.image ? (
                    <>
                      <Image
                        src={job.image.src}
                        alt=""
                        width={job.image.width}
                        height={job.image.height}
                        sizes="(min-width: 768px) 60vw, 100vw"
                        className="absolute inset-0 -z-20 size-full object-cover"
                      />
                      <span aria-hidden className="absolute inset-0 -z-10 bg-black/65" />
                    </>
                  ) : null}
                  <h3 className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-medium leading-[1.15] tracking-[-0.025em]">
                    {tc(job.key)}
                  </h3>
                  <p className="max-w-sm leading-relaxed text-fg/80">{t(`jobs.${job.key}`)}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0 md:pt-0" labelledBy="process">
        <Reveal>
          <Heading id="process">{t("processTitle")}</Heading>
        </Reveal>
        <ol className="mt-10 divide-y divide-line border-y border-line md:mt-14">
          {STEPS.map((step, position) => (
            <li key={step}>
              <Reveal delay={position * 0.04}>
                <div className="grid gap-3 py-8 md:grid-cols-12 md:gap-12 md:py-12">
                  <h3 className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] md:col-span-5">
                    {t(`process.${step}.title`)}
                  </h3>
                  <p className="max-w-lg leading-relaxed text-mute md:col-span-6 md:col-start-7">
                    {t(`process.${step}.text`)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />
    </>
  );
}
