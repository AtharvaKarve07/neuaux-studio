import "@fontsource-variable/unbounded";
import "@fontsource-variable/onest";
import "../globals.css";

import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LocaleTransition } from "@/components/locale-transition";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";
import { OG_LOCALE } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: t("template") },
    description: t("description"),
    applicationName: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: OG_LOCALE[locale],
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale}>
      <body id="top">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[var(--z-toast)] focus:bg-accent focus:px-4 focus:py-3 focus:text-black"
          >
            {t("skip")}
          </a>
          <Providers>
            <SiteHeader />
            <LocaleTransition>
              <main id="main">{children}</main>
              <SiteFooter />
            </LocaleTransition>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
