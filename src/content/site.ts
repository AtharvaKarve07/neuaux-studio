export const site = {
  name: "neuaux.studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://neuaux.studio",
  email: "neuaux.studio@gmail.com",
  whatsapp: {
    /** Shown on the site, in international format. */
    display: "+48 502 876 580",
    /** Digits only (country code + number, no + or spaces), used to build the wa.me link. */
    number: "48502876580",
    get url() {
      return `https://wa.me/${this.number}`;
    },
  },
  instagram: {
    handle: "@neuaux.studio",
    url: "https://www.instagram.com/neuaux.studio/",
  },
  /** Add a booking link here (Cal.com, Calendly) when you have one. It shows up on the contact page. */
  calendarUrl: null as string | null,
} as const;

/**
 * The team, shown on the About page. Everything about one person lives in one entry here,
 * including their role in every language, so adding or removing someone never touches the
 * `messages/*.json` files.
 *
 * To add someone: add an object below and drop their photo in /public/team.
 * To remove someone: delete their object. The About page layout adjusts on its own.
 */
export const team = [
  {
    id: "atharva",
    name: "Atharva Karve",
    role: {
      en: "Founder and creative head",
      pl: "Założyciel i szef kreatywny",
      uk: "Засновник і креативний керівник",
    },
    photo: "/team/atharva.jpeg",
    placeholder: true,
  },
  /**{
    id: "pratik",
    name: "Pratik Paithankar",
    role: {
      en: "Photographer and videographer",
      pl: "Fotograf i filmowiec",
      uk: "Фотограф і відеограф",
    },
    photo: "/team/pratik.webp",
    placeholder: true,
  },*/
] as const;

export type TeamMember = (typeof team)[number];

/** Ids used by the contact form. Labels come from messages/*.json. */
export const budgetRanges = ["under2k", "2to5k", "5to10k", "over10k", "unsure"] as const;
export const formats = ["photo", "video", "both"] as const;
export const callTimes = ["morning", "afternoon", "evening"] as const;

export type BudgetRange = (typeof budgetRanges)[number];
export type Format = (typeof formats)[number];
export type CallTime = (typeof callTimes)[number];
