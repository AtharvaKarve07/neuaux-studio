# neuaux.studio

Portfolio and booking site for neuaux.studio, a two-person photo and video studio in Warsaw.
English, Polish and Ukrainian. Built to deploy on Vercel.

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, tokens in `src/app/globals.css` |
| Languages | next-intl, routes `/en`, `/pl`, `/uk` |
| Motion | `motion` (springs, gestures), `torph` (nav label morph), CSS keyframes and transitions |
| Primitives | Base UI (viewer and mobile menu dialogs) |
| State | zustand (viewer and menu) |
| Smooth scroll | Lenis (mouse wheel only; touch scrolling stays native) |
| Icons | Phosphor (light weight) |
| Fonts | Unbounded and Onest, self-hosted through Fontsource (Latin, Latin Extended, Cyrillic) |
| Form email | Resend, sent from `src/app/api/contact/route.ts` |

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

Node 20.9 or newer (`.nvmrc` says 22).

## What is where

```
messages/            all copy, one JSON file per language (en, pl, uk)
public/work/         portfolio images (also video posters)
public/video/        portfolio video files
public/team/         team portraits
public/logo.svg      the logo, traced from your PNG (single path, takes the text color)
src/content/work.ts  the portfolio list, in display order
src/content/site.ts  email, Instagram, team, calendar link, budget ranges
src/components/      UI: header, hero, work grid, viewer, video player, form
src/app/[locale]/    pages: home, work, services, about, contact
src/app/api/contact  booking form endpoint
```

## Replace the placeholders

Everything you see now is a stand-in. The site marks placeholder images in the viewer
("Sample image. Replace with your own work.") until you remove the flag.

1. **Photos and videos.** Put files in `public/work` (images) and `public/video` (video).
   Open `src/content/work.ts`, edit the matching entry (`src`, `width`, `height`, `video.src`,
   `category`) and delete `placeholder: true`. Add or remove entries freely, the collage adapts.
   A video needs a poster image in `src`, which is what visitors see before pressing play.
2. **Titles.** Each item's caption is `viewer.titles.<id>` in `messages/*.json`.
   Use the same `id` when you add an item, and add the title in all three languages.
3. **Team.** Everyone on the About page comes from the `team` array in `src/content/site.ts`
   — name, role in all three languages, and photo all live in one place per person.
   - **Add someone:** add an object to the array and drop their photo in `public/team`.
   - **Remove someone:** delete their object. The page's layout adjusts on its own,
     for any number of people.
   - **Update a real photo:** replace the file in `public/team` and set that
     person's `placeholder: false`.
4. **Calendar.** When you have a booking link, set `calendarUrl` in `src/content/site.ts`
   and it appears on the contact page.
5. **Budget ranges.** Edit the labels under `contact.options.budgets` in each language file,
   and the matching labels in `src/app/api/contact/route.ts` (they appear in your email).
6. **Delete the sample videos** in `public/video/` once real ones are in.
7. **Hero image.** The framed picture in the home hero is the work item with id `cr-02`.
   To use a different one, change `HERO_ITEM` in `src/components/hero.tsx` to any id from
   `src/content/work.ts` (a portrait or 4:5 picture fits the frame best).

### Video files

- MP4, H.264, 1080p at most, 24 or 30 fps, no more than about 15 MB per clip.
- Export with "fast start" (web optimized) so playback begins immediately.
- Videos never autoplay. Tapping a video tile opens the viewer and plays it (that tap is the
  click). Swiping or pressing an arrow onto a video does not start it.
- Instagram does not give out files. Use the originals from your camera or editor.
- Many long videos will use a lot of bandwidth. If the collection grows, host them on
  Vercel Blob, Cloudflare Stream or Mux and put the full URL in `video.src`.

## Contact form

The form posts to `/api/contact`, which emails you through Resend.

1. Create a free account at resend.com and make an API key.
2. In Vercel, add the environment variables from `.env.example`:
   `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `NEXT_PUBLIC_SITE_URL`.
3. Until you verify a domain in Resend, keep the default `CONTACT_FROM`
   (`onboarding@resend.dev`). It can only deliver to the email address that owns the Resend
   account, so sign up with `neuaux.studio@gmail.com`. After verifying `neuaux.studio`,
   set `CONTACT_FROM=neuaux.studio <hello@neuaux.studio>`.

Without a key the form still validates, then tells the visitor to write to your email address.
Spam protection: a hidden honeypot field and a per-IP limit of 5 requests per 10 minutes.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New, Project**, import the repository. Framework is detected
   as Next.js; no settings need changing.
3. Add the environment variables above, then deploy.
4. **Settings, Domains**: add `neuaux.studio` and follow the DNS instructions.
5. The site redirects `/` to the visitor's language (from the browser setting, falling back to English).

## Design system in one place

- **Colors**: `--color-void` (pure black), `--color-fg`, `--color-mute`, and one accent,
  `--color-accent`. Change the accent in `src/app/globals.css`; everything follows.
- **Shape**: everything is sharp (radius 0). There is no rounded corner anywhere.
- **Type**: Unbounded for display, Onest for text. Both cover Polish and Ukrainian.
- **Motion**: shared curves and springs in `src/lib/motion.ts` and `globals.css`.
  Every animation respects the system "reduce motion" setting.
- **Layers**: z-index scale in `src/lib/z.ts` (mirrored as CSS variables).

## Before you launch

- Have a native speaker read the Polish and Ukrainian copy in `messages/pl.json` and
  `messages/uk.json`.
- Replace every `placeholder: true` item with real work.
- Send a test booking from your phone.
- Check `https://your-domain/sitemap.xml` and share a link once to see the preview image
  (`public/og.png`). Replace it with a real image when you have one.
