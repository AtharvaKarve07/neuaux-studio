"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { budgetRanges, callTimes, formats, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { Button } from "./button";

const SHOOT_TYPES = ["realEstate", "events", "portraits", "creative", "food", "street", "other"] as const;
type FieldName = "name" | "email" | "shoot" | "format" | "budget" | "day" | "time";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const control =
  "h-12 w-full border border-line-strong bg-black px-4 text-fg transition-colors duration-150 ease-out placeholder:text-mute hover:border-fg/60 focus-visible:border-accent aria-[invalid=true]:border-accent";

export function ContactForm() {
  const t = useTranslations("contact");
  const tc = useTranslations("categories");
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState("");
  const [banner, setBanner] = useState("");

  // Earliest selectable call day is today, in the visitor's own calendar.
  const [minDay] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const text = (key: string) => String(data.get(key) ?? "").trim();
    if (text("name").length < 2) next.name = t("errors.required");
    if (!text("email")) next.email = t("errors.required");
    else if (!EMAIL_PATTERN.test(text("email"))) next.email = t("errors.email");
    if (!text("shoot")) next.shoot = t("errors.choose");
    if (!text("format")) next.format = t("errors.choose");
    if (!text("budget")) next.budget = t("errors.choose");
    if (!text("day") || text("day") < minDay) next.day = t("errors.required");
    if (!text("time")) next.time = t("errors.choose");
    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    setBanner("");

    const firstInvalid = (Object.keys(found) as FieldName[])[0];
    if (firstInvalid) {
      const element = form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      element?.focus();
      return;
    }

    setStatus("sending");
    const payload = {
      locale,
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      shoot: String(data.get("shoot")),
      format: String(data.get("format")),
      budget: String(data.get("budget")),
      day: String(data.get("day")),
      time: String(data.get("time")),
      message: String(data.get("message") ?? "").trim(),
      company: String(data.get("company") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSentTo(payload.email);
        setStatus("success");
        return;
      }
      const message = response.status === 429 ? t("errors.rate") : t("errors.send", { email: site.email });
      setBanner(message);
      toast.error(message);
    } catch {
      const message = t("errors.send", { email: site.email });
      setBanner(message);
      toast.error(message);
    }
    setStatus("idle");
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="flex min-h-[22rem] flex-col justify-between gap-12 p-6 md:p-10"
        >
          <span className="grid size-14 place-items-center bg-accent text-black">
            <Check size={28} weight="light" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-[clamp(1.6rem,3.6vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.035em]">
              {t("success.title")}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-mute">{t("success.text", { email: sentTo })}</p>
            <Button
              variant="secondary"
              className="mt-8"
              onClick={() => {
                formRef.current?.reset();
                setStatus("idle");
              }}
            >
              {t("success.again")}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="grid gap-6 p-6 md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="name" label={t("fields.name")} error={errors.name}>
              {(props) => (
                <input
                  {...props}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={control}
                  aria-invalid={Boolean(errors.name)}
                />
              )}
            </Field>
            <Field name="email" label={t("fields.email")} error={errors.email}>
              {(props) => (
                <input
                  {...props}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  className={control}
                  aria-invalid={Boolean(errors.email)}
                />
              )}
            </Field>
          </div>

          <Field name="shoot" label={t("fields.shoot")} error={errors.shoot}>
            {(props) => (
              <Select {...props} name="shoot" invalid={Boolean(errors.shoot)} placeholder={t("options.choose")}>
                {SHOOT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === "other" ? t("options.other") : tc(type)}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Segmented
            name="format"
            legend={t("fields.format")}
            error={errors.format}
            options={formats.map((value) => ({ value, label: t(`options.formats.${value}`) }))}
          />

          <Field name="budget" label={t("fields.budget")} hint={t("hints.budget")} error={errors.budget}>
            {(props) => (
              <Select {...props} name="budget" invalid={Boolean(errors.budget)} placeholder={t("options.choose")}>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {t(`options.budgets.${range}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field name="day" label={t("fields.day")} error={errors.day}>
            {(props) => (
              <input
                {...props}
                name="day"
                type="date"
                min={minDay}
                required
                className={cn(control, "appearance-none")}
                aria-invalid={Boolean(errors.day)}
              />
            )}
          </Field>

          <Segmented
            name="time"
            legend={t("fields.time")}
            hint={t("hints.time")}
            error={errors.time}
            options={callTimes.map((value) => ({ value, label: t(`options.times.${value}`) }))}
          />

          <Field name="message" label={t("fields.message")}>
            {(props) => (
              <textarea
                {...props}
                name="message"
                rows={4}
                maxLength={2000}
                placeholder={t("hints.message")}
                className={cn(control, "h-auto min-h-28 resize-y py-3")}
              />
            )}
          </Field>

          {/* Honeypot: real visitors never see or fill this. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Company
              <input name="company" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {banner ? (
            <p role="alert" className="border-l-2 border-accent bg-panel px-4 py-3 text-[0.9375rem] text-fg">
              {banner}
            </p>
          ) : null}

          <div>
            <Button type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="w-full md:w-auto">
              {status === "sending" ? t("sending") : t("submit")}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

interface ControlProps {
  id: string;
  "aria-describedby"?: string;
}

interface FieldProps {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: ControlProps) => ReactNode;
}

/** Label above the control, hint or error below. Hands the control its id and aria-describedby. */
function Field({ name, label, hint, error, children }: FieldProps) {
  const base = useId();
  const id = `${base}-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children({ id, "aria-describedby": describedBy })}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-mute">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-[0.8125rem] text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface SelectProps extends Partial<ControlProps> {
  name: string;
  invalid: boolean;
  placeholder: string;
  children: ReactNode;
}

/** Native select: the best picker on a phone. The caret is drawn over it. */
function Select({ name, invalid, placeholder, children, id, "aria-describedby": describedBy }: SelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required
        defaultValue=""
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(control, "appearance-none pr-12")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      <CaretDown size={18} weight="light" aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute" />
    </div>
  );
}

interface SegmentedProps {
  name: FieldName;
  legend: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
}

function Segmented({ name, legend, hint, error, options }: SegmentedProps) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium text-fg">{legend}</legend>
      <div className={cn("grid gap-2", options.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {options.map((option) => (
          <label key={option.value} className="relative block">
            <input type="radio" name={name} value={option.value} className="peer sr-only" />
            <span className="grid min-h-12 place-items-center border border-line-strong px-2 text-center text-[0.9375rem] text-fg transition-colors duration-150 ease-out hover:border-fg/60 peer-checked:border-fg peer-checked:bg-fg peer-checked:text-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {hint && !error ? <p className="text-[0.8125rem] text-mute">{hint}</p> : null}
      {error ? <p className="text-[0.8125rem] text-accent">{error}</p> : null}
    </fieldset>
  );
}
