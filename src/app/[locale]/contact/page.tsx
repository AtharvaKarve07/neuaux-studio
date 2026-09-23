import { CalendarBlank, EnvelopeSimple, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bezel } from "@/components/bezel";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { Heading, shell } from "@/components/section";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/contact", "contact");
}

const directLink =
  "inline-flex min-h-11 items-center gap-3 text-fg transition-colors duration-150 ease-out hover:text-accent";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <section aria-labelledby="contact-title" className="px-4 pb-24 pt-32 md:px-8 md:pb-32 md:pt-44">
      <div className={cn(shell, "grid gap-12 lg:grid-cols-12 lg:gap-x-8")}>
        <Reveal className="lg:col-span-4 lg:row-start-1">
          <Heading as="h1" id="contact-title">
            {t("title")}
          </Heading>
          <p className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-mute">{t("text")}</p>
        </Reveal>

        <Reveal className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1" delay={0.06}>
          <Bezel>
            <ContactForm />
          </Bezel>
        </Reveal>

        <Reveal className="lg:col-span-4 lg:row-start-2 lg:self-end" delay={0.1}>
          <h2 className="font-display text-lg font-medium tracking-[-0.02em]">{t("direct.title")}</h2>
          <ul className="mt-4 flex flex-col">
            <li>
              <a href={`mailto:${site.email}`} className={directLink}>
                <EnvelopeSimple size={22} weight="light" aria-hidden />
                <span>
                  <span className="sr-only">{t("direct.email")}: </span>
                  {site.email}
                </span>
              </a>
            </li>
            <li>
              <a href={site.instagram.url} className={directLink}>
                <InstagramLogo size={22} weight="light" aria-hidden />
                <span>
                  <span className="sr-only">{t("direct.instagram")}: </span>
                  {site.instagram.handle}
                </span>
              </a>
            </li>
            <li>
              <a href={site.whatsapp.url} className={directLink}>
                <WhatsappLogo size={22} weight="light" aria-hidden />
                <span>
                  <span className="sr-only">{t("direct.whatsapp")}: </span>
                  {site.whatsapp.display}
                </span>
              </a>
            </li>
            {site.calendarUrl ? (
              <li>
                <a href={site.calendarUrl} className={directLink}>
                  <CalendarBlank size={22} weight="light" aria-hidden />
                  <span>{t("title")}</span>
                </a>
              </li>
            ) : null}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
