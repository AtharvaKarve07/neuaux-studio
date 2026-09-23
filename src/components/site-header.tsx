"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useTranslations } from "next-intl";
import { useEffect, type CSSProperties } from "react";
import { site } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { useUi } from "@/store/ui";
import { ButtonLink, buttonStyles } from "./button";
import { LangSwitcher } from "./lang-switcher";
import { Logo } from "./logo";
import { MorphText } from "./morph-text";

const NAV = [
  { href: "/work", key: "work" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

/**
 * Detached floating bar (not glued to the top edge). Links show from lg upwards;
 * below that a full-screen menu takes over. Frosted glass is applied to this fixed layer only.
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const menuOpen = useUi((state) => state.menuOpen);
  const setMenuOpen = useUi((state) => state.setMenuOpen);
  const toggleMenu = useUi((state) => state.toggleMenu);

  // Any navigation closes the menu.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] px-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6 md:pt-4">
        <div className="glass mx-auto flex h-14 max-w-[1400px] items-center justify-between border border-line pl-4 pr-1">
          <Link href="/" aria-label={t("home")} className="flex items-center gap-3 text-fg">
            <Logo className="h-7 w-auto" />
            <span className="font-display text-[0.8125rem] font-medium tracking-[-0.02em]">{site.name}</span>
          </Link>

          <nav aria-label={t("label")} className="hidden items-center gap-1 lg:flex">
            {NAV.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "relative grid h-11 place-items-center px-4 text-sm font-medium transition-colors duration-150 ease-out",
                  isActive(href) ? "text-fg" : "text-mute hover:text-fg",
                )}
              >
                <MorphText id={`nav.${key}`} as="span">
                  {t(key)}
                </MorphText>
                {isActive(href) ? <span aria-hidden className="absolute inset-x-4 bottom-2 h-px bg-accent" /> : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <LangSwitcher />
            <div className="ml-2 hidden lg:block">
              <ButtonLink href="/contact">{t("book")}</ButtonLink>
            </div>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? t("closeMenu") : t("menu")}
              onClick={toggleMenu}
              className="relative ml-1 grid size-11 place-items-center lg:hidden"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute h-px w-6 bg-fg transition-transform duration-[350ms] ease-drawer",
                  menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute h-px w-6 bg-fg transition-transform duration-[350ms] ease-drawer",
                  menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} isActive={isActive} />
    </>
  );
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive: (href: string) => boolean;
}

function MobileMenu({ open, onOpenChange, isActive }: MobileMenuProps) {
  const t = useTranslations("nav");

  // The header bar stays clickable, so focus is trapped but pointer input outside is not blocked.
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal="trap-focus">
      <Dialog.Portal>
        <Dialog.Popup
          id="site-menu"
          data-lenis-prevent
          className="group glass fixed inset-0 z-[var(--z-menu)] flex flex-col overflow-y-auto bg-black/90 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-28 outline-none transition-[opacity,transform] duration-[350ms] ease-drawer data-[ending-style]:-translate-y-2 data-[starting-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 lg:hidden"
        >
          <Dialog.Title className="sr-only">{t("menuLabel")}</Dialog.Title>

          <nav aria-label={t("label")}>
            <ul className="flex flex-col gap-1">
              {NAV.map(({ href, key }, position) => (
                <li key={key} style={{ "--i": position } as CSSProperties} className={stagger}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={cn(
                      "block py-3 font-display text-[clamp(1.75rem,8.4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] transition-colors duration-150 ease-out",
                      isActive(href) ? "text-accent" : "text-fg",
                    )}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-6 pt-12">
            <div style={{ "--i": 4 } as CSSProperties} className={stagger}>
              <ButtonLink href="/contact">{t("book")}</ButtonLink>
            </div>
            <div style={{ "--i": 5 } as CSSProperties} className={cn(stagger, "flex flex-col gap-1 text-[0.9375rem] text-mute")}>
              <a href={`mailto:${site.email}`} className="py-1 hover:text-fg">
                {site.email}
              </a>
              <a href={site.instagram.url} className="py-1 hover:text-fg">
                {site.instagram.handle}
              </a>
              <a href={site.whatsapp.url} className="py-1 hover:text-fg">
                {site.whatsapp.display}
              </a>
            </div>
            <div style={{ "--i": 6 } as CSSProperties} className={stagger}>
              <Dialog.Close className={cn(buttonStyles({ variant: "secondary" }), "w-full")}>{t("closeMenu")}</Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Links rise into place one after another when the menu opens, and leave together, without delay. */
const stagger =
  "translate-y-0 opacity-100 transition-[opacity,transform] duration-500 ease-drawer [transition-delay:calc(120ms+var(--i)*55ms)] group-data-[starting-style]:translate-y-6 group-data-[starting-style]:opacity-0 group-data-[ending-style]:opacity-0 group-data-[ending-style]:[transition-delay:0ms]";
