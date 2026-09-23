import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/button";
import { Heading, shell } from "@/components/section";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section aria-labelledby="nf-title" className="flex min-h-[100dvh] items-center px-4 py-32 md:px-8">
      <div className={shell}>
        <Heading as="h1" id="nf-title">
          {t("title")}
        </Heading>
        <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-mute">{t("text")}</p>
        <div className="mt-10">
          <ButtonLink href="/">{t("home")}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
