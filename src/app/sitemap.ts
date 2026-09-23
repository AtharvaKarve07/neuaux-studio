import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

const PATHS = ["", "/work", "/services", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((code) => [code, `${site.url}/${code}${path}`])),
      },
    })),
  );
}
