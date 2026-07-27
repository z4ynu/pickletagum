# Tagum Pickleball Court Directory — Planning

## 1. Project Summary

Pickleball courts in Tagum City are booked across a scattered mix of platforms — some on PickleHub, some on custom-built sites, and many only reachable through a Facebook page or a phone number. There is no single place to see what courts exist and where to go to check them out. This project is a static, single-page directory that lists every known pickleball court in Tagum City, lets people search and filter by area or court type, and links out to each court's actual booking method. It solves a discovery problem, not a booking problem — the site itself never takes a reservation, an account, or a payment.

## 2. Goals vs. Non-Goals

**Goals**
- List every known court in Tagum City in one place
- Let people search by name/area and filter by barangay and indoor/outdoor
- Send people to the *correct* place to book — PickleHub, a custom site, a Facebook page, or a phone number
- Be honest and upfront that this is an independent, unofficial directory
- Be fast, static, and cheap/free to run and maintain solo

**Non-Goals (explicitly out of scope for v1)**
- No authentication or user accounts of any kind
- No live/real-time court availability
- No booking or reservation functionality on this site itself
- No weekly schedule view per court
- No handling of payment or personal info — the site only links out

## 3. Features

### v1 (build this)
- Static court list with: name, barangay/area, indoor/outdoor, number of courts, price range (optional), a short note, one correct outbound link, and a "last verified" date
- Client-side search (name/area) and filters (barangay, indoor/outdoor)
- Visible disclaimer banner: independent/unofficial, not affiliated with any court or platform, bookings/accounts/payments happen on the linked site
- "Submit a court" link (mailto or Formspree/Google Form embed — no custom backend)
- Fully responsive, mobile-first (most traffic will be on phones)

### Possible v2 (explicitly out of scope for now)
- Crowdsourced "is it full right now" status, community-updated
- Court owner dashboard to self-manage their own listing (would require lightweight auth, scoped only to owners)
- Weekly operating-hours/schedule view per court
- Featured/verified listing placement (monetization)
- Open-play / find-a-partner board, local tournament calendar
- Expansion template to other cities (e.g. Davao)

## 4. Design Direction

An HTML mockup will be provided alongside this doc. It defines **structure only**: section order (hero → disclaimer → filter bar → card grid → footer), what content lives in each region, and the general shape of a court card. It is a layout skeleton, not a style guide.

Do not carry over the mockup's literal fonts, colors, spacing, or component styling. The shipped design should read as modern and intentionally designed, not templated or "vibe-coded." Concretely:
- **Type pairing:** a distinct display face for the hero/headings paired with a clean, legible body face — a real pairing chosen for this project, not a system-default stack. *(Proposed direction: a characterful, slightly condensed display face for headings — e.g. Space Grotesk or Söhne — paired with Inter or system-ui for body text. Lock in during Milestone 2.)*
- **Palette:** a considered, specific palette with one clear accent color — not generic Bootstrap blue, default Tailwind gray, or an unmodified AI-cliché combo (e.g. warm-cream-plus-terracotta, or near-black-plus-neon-green used without any other distinguishing choice). *(Proposed direction: draw one accent from the sport itself — e.g. pickleball-yellow or court-green — grounded in a neutral base that isn't pure white/gray. Lock in during Milestone 2.)*
- **Avoid AI-generated tells:** no generic centered-headline-plus-two-buttons hero with no personality, no identical copy-paste cards with zero visual rhythm, no everything-has-the-same-border-radius look, no stock gradient blobs.
- **Details matter:** intentional spacing scale, real hover/focus/transition states, and one small signature visual element (e.g. how the disclaimer is framed, how cards indicate booking method) that makes the page feel like a considered product.

Design direction should be explicitly locked (palette + type pairing + signature element, written down) before UI build starts — see Milestone 2.

## 5. Data Model

Court data lives in a single static file: `data/courts.json`. No database for v1.

| Field | Type | Notes |
|---|---|---|
| `id` | string | unique slug, e.g. `"magugpo-sports-hub"` |
| `name` | string | court/venue name |
| `area` | string | barangay/area |
| `types` | `("indoor" \| "outdoor")[]` | One or both court environments, e.g. `["indoor", "outdoor"]`. |
| `court_count` | number | number of courts on-site |
| `price_range` | string \| null | optional, free text (e.g. `"₱150–200/hr"`) |
| `image` | `{ src: string \| null, alt: string \| null }` | Court preview image. Use a site-relative path such as `"/images/courts/the-lob.jpg"`; leave both values `null` until an approved venue image is available. |
| `booking_method` | `"pickle_hub"` \| `"custom_site"` \| `"facebook"` \| `"phone"` | drives which link/label/icon is shown |
| `link` | string | URL, or a `tel:`/`mailto:` value for phone-only courts |
| `facebook_link` | string \| null | Optional official Facebook page. When present, the card shows a second “Visit Facebook page” action. |
| `note` | string | short human note, e.g. `"No online booking — message their FB page"` |
| `last_verified` | string (ISO date) | e.g. `"2026-07-20"` |

Example entry:

```json
{
  "id": "magugpo-sports-hub",
  "name": "Magugpo Sports Hub",
  "area": "Magugpo Poblacion",
  "types": ["outdoor", "indoor"],
  "court_count": 4,
  "price_range": "₱150–200/hr",
  "image": {
    "src": "/images/courts/magugpo-sports-hub.jpg",
    "alt": "Four outdoor pickleball courts at Magugpo Sports Hub"
  },
  "booking_method": "pickle_hub",
  "link": "https://pickle-hub.example/magugpo-sports-hub",
  "facebook_link": "https://www.facebook.com/example-court",
  "note": "Books through PickleHub's calendar.",
  "last_verified": "2026-07-25"
}
```

## 6. Proposed File/Folder Structure (Astro)

```
tagum-pickleball/
├── astro.config.mjs
├── tailwind.config.cjs
├── package.json
├── PLANNING.md
├── data/
│   └── courts.json
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── DisclaimerBanner.astro
│   │   ├── FilterBar.astro
│   │   ├── SearchBar.astro
│   │   ├── CourtCard.astro
│   │   ├── CourtGrid.astro
│   │   └── Footer.astro
│   ├── scripts/
│   │   └── filter.js        # client-side search/filter logic
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
└── public/
    └── favicon, og-image, etc.
```

## 7. Build Order / Milestones

1. **Scaffold project** — `npm create astro@latest`, add Tailwind, basic repo/deploy pipeline
2. **Lock design direction** — finalize type pairing, palette, and signature element per Section 4; write choices down before touching component code
3. **Build data file** — populate `data/courts.json` with 5–10 real or sample Tagum courts
4. **Build static list + card UI** — render `CourtCard`/`CourtGrid` from the JSON, no interactivity yet
5. **Add search + filter** — client-side JS over the static data (name/area search, barangay + indoor/outdoor filters)
6. **Add disclaimer banner + submit-a-court** — wire up the mailto/Formspree link
7. **Responsive pass** — verify mobile layout, tap targets, readability at small widths
8. **Polish pass** — hover/focus states, transitions, accessibility check (contrast, keyboard nav)
9. **Deploy** — push to Vercel/Netlify/Cloudflare Pages, connect domain if ready

## 8. Open Questions / Decisions Needed

- Final, verified list of real Tagum City courts, their areas, and correct outbound links
- Which booking method actually applies to each court (confirm directly with owners where possible)
- Domain name (and whether to register one now or launch on a free subdomain first)
- Final palette/type pairing sign-off (Milestone 2 output)
- Whether "submit a court" goes through a mailto link or a Formspree/Google Form embed for v1
