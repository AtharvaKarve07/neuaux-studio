import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

export const OG_LOCALE: Record<string, string> = { en: "en_GB", pl: "pl_PL", uk: "uk_UA" };

/** Canonical and hreflang alternates for one page, in every language. */
export function alternatesFor(locale: string, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((code) => [code, `/${code}${path}`]),
  );
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

type PageKey = "work" | "services" | "about" | "contact";

/** Title, description and alternates for an inner page. The layout supplies the title template. */
export async function pageMetadata(locale: string, path: string, page: PageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t(`pages.${page}`),
    description: t("description"),
    alternates: alternatesFor(locale, path),
    openGraph: { url: `${site.url}/${locale}${path}`, title: t("template", { title: t(`pages.${page}`) }) },
  };
}
