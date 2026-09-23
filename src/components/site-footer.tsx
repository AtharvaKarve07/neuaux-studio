import { ArrowUp, EnvelopeSimple, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";

const LINKS = [
  { href: "/work", key: "work" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="border-t border-line px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-16 md:px-8 md:pt-24">
      <div className="mx-auto grid w-full max-w-[1400px] gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="h-16 w-auto text-fg" />
          <p className="mt-6 font-display text-lg font-medium tracking-[-0.02em]">{site.name}</p>
          <p className="mt-1 max-w-xs text-mute">{t("about")}</p>
        </div>

        <nav aria-label={tn("label")} className="md:col-span-3 md:col-start-7">
          <ul className="flex flex-col gap-1">
            {LINKS.map(({ href, key }) => (
              <li key={key}>
                <Link href={href} className="inline-block py-1.5 text-fg transition-colors duration-150 ease-out hover:text-accent">
                  {tn(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-1 md:col-span-3">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-3 py-1.5 text-fg transition-colors duration-150 ease-out hover:text-accent"
          >
            <EnvelopeSimple size={20} weight="light" aria-hidden />
            {site.email}
          </a>
          <a
            href={site.instagram.url}
            className="inline-flex items-center gap-3 py-1.5 text-fg transition-colors duration-150 ease-out hover:text-accent"
          >
            <InstagramLogo size={20} weight="light" aria-hidden />
            {site.instagram.handle}
          </a>
          <a
            href={site.whatsapp.url}
            className="inline-flex items-center gap-3 py-1.5 text-fg transition-colors duration-150 ease-out hover:text-accent"
          >
            <WhatsappLogo size={20} weight="light" aria-hidden />
            {site.whatsapp.display}
          </a>
          <p className="mt-3 text-mute">{t("city")}</p>
        </div>
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm text-mute">
        <p>
          © 2026 {site.name}. {t("rights")}
        </p>
        <a href="#top" className="inline-flex min-h-11 items-center gap-2 text-fg transition-colors duration-150 ease-out hover:text-accent">
          <ArrowUp size={18} weight="light" aria-hidden />
          {t("top")}
        </a>
      </div>
    </footer>
  );
}
