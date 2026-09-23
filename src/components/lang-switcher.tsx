"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const SHORT: Record<string, string> = { en: "EN", pl: "PL", uk: "UA" };

/** Switches language on the current page. Scroll position is kept. */
export function LangSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("lang");
  const tn = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div role="group" aria-label={tn("language")} className={cn("flex items-center", className)}>
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={t(code)}
            aria-pressed={active}
            disabled={pending}
            onClick={() => {
              if (active) return;
              startTransition(() => router.replace(pathname, { locale: code, scroll: false }));
            }}
            className={cn(
              "relative grid h-11 min-w-10 place-items-center px-2 text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-150 ease-out",
              active ? "text-fg" : "text-mute hover:text-fg",
            )}
          >
            {SHORT[code]}
            {active ? <span aria-hidden className="absolute inset-x-2 bottom-2.5 h-px bg-accent" /> : null}
          </button>
        );
      })}
    </div>
  );
}
