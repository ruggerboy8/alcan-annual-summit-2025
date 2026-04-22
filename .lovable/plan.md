

# Phase 1: 2026 Content & Visual Refresh

A focused content overhaul + premium visual polish to make the site feel exciting and "coming soon" while we wait for speakers, agenda, and the new registration flow.

---

## What you'll see when this is done

- Every "2025" reference updated to "2026" (countdown, hero badge, footer, page metadata, social previews)
- A bigger, more dramatic countdown that feels like part of the hero
- Speakers section turned into a teaser with last year's hype video embedded
- Agenda section turned into an elegant "Coming soon" placeholder
- Travel section's hotel block updated to a "Call the hotel, mention Alcan" instruction
- Tighter typography, spacing, and animation polish across the page
- Register CTAs left untouched for now (we'll rework them in the next phase)

---

## 1A — Content Updates

### Year & date references
- `index.html`: page title, description, OG/Twitter tags → "The Summit 2026"
- `Hero.tsx`: change the date badge from "December 11 – 12" to **"December 2026 — Dates Coming Soon"** (since exact dates aren't set)
- `CountdownTimer.tsx`: replace the hard-coded December 11, 2025 target with a configurable 2026 target. Since dates aren't final, switch the label to something like **"The next ascent begins in"** with a placeholder target date you can edit in one spot (e.g. Dec 1, 2026), or hide the timer if you'd rather wait — I'll default to keeping it with a tentative date and a note in the code so you can update it the moment dates are locked.
- `Footer.tsx`: copyright → 2026

### Speakers → "Coming Soon" + hype video
- Keep the section heading ("Featured Speakers") but soften it to **"Speakers"**
- Replace subhead with a teaser: *"We're curating an unforgettable lineup. Stay tuned."*
- Replace the 7-card grid with a single full-width video player embedding last year's hype video (you'll upload an MP4 to `/public/lovable-uploads/`)
- Native `<video>` element with poster frame, controls, rounded corners, soft shadow, and a subtle gradient frame to feel premium
- All seven existing speaker objects will be commented out in the file (not deleted) so we can restore them easily for 2026

### Agenda → placeholder
- Keep the section + heading
- Replace the two collapsible day cards with a single elegant centered card:
  - Headline: **"The 2026 agenda is taking shape"**
  - Subcopy: *"Two days. Sharper skills. Deeper friendships. New altitudes. Full agenda dropping soon."*
  - Subtle mountain icon or divider accent
- Existing agenda data array will be commented out for easy restoration

### Travel → hotel block rework
- Remove the "Book Hotel Room" Marriott button and link
- Replace the Hotel Accommodations block with:
  - **Fairfield Inn & Suites Austin Buda**
  - "Call the hotel directly and **mention Alcan** to receive your discounted group rate."
  - Phone number (clickable `tel:` link) — *placeholder until you provide the number*
  - Hotel website link (placeholder until you provide it)
- Venue details, "Getting There", and the embedded map stay as-is

---

## 1B — Visual / Premium Upgrades

### Hero polish
- Tighten the vertical rhythm between logo, headline, date badge, and CTA (currently uses big mb-10/mb-14 gaps that feel uneven on shorter viewports)
- Refine the date badge: thinner border, slightly more letter-spacing, subtle inner glow
- Headline: reduce drop-shadow heaviness, add a subtle letter-spacing tweak for the Biondi font
- CTA button: add a subtle shimmer/hover lift effect for a more premium feel
- Slight darkening of the bottom of the video overlay for better text legibility

### Countdown redesign (hero-adjacent, high impact)
Currently a small white-background block. Redesign it as:
- **Dark/transparent background** that visually bridges the Hero into the page (gradient from black to white, or a deep navy band)
- **Much larger numerals** (clamp-sized typography, e.g. ~80–120px on desktop)
- Each unit (Days/Hours/Minutes/Seconds) gets a thin animated ring or border accent
- Subtle pulse animation on the seconds digit
- Refined label typography (uppercase, letter-spaced, smaller, lighter weight)
- Mountain-themed flourish: thin gold/accent rule between numerals and labels

### Section transition pass
- Add consistent fade-in-on-scroll using `framer-motion`'s `whileInView` on each section's headline + content (matching the easing curve used in Hero)
- Standardize section vertical padding (currently varies: py-12, py-14, py-20)
- Smooth color hand-offs between sections (the white→gray→white→gray pattern works; just ensure the new countdown ties Hero into About elegantly)

### Color & contrast pass
- Audit body text against backgrounds — a few spots use `text-gray-600` on `bg-gray-50` which sits below WCAG AA
- Make sure all CTAs use the same primary blue and same hover treatment
- Verify the mist overlay in the Hero isn't washing out the date badge on mobile

### Navigation cleanup
- "Speakers" and "Agenda" links stay (they scroll to the new "coming soon" sections, which is fine)
- No structural changes to nav in this phase

---

## What we're NOT touching this phase
- Register buttons & Jotform modal — kept as-is until the Supabase registration build
- Pre-registration / interest form — handled in the next phase
- About section copy — already on-brand for the Summit story
- Image carousel — last year's photos still represent the experience well

---

## Technical details (for reference)

**Files modified:**
- `index.html` — metadata
- `src/components/Hero.tsx` — date badge copy, spacing, polish
- `src/components/CountdownTimer.tsx` — full visual redesign + new target date
- `src/components/Speakers.tsx` — replace grid with video embed; comment out speaker data
- `src/components/Agenda.tsx` — replace collapsibles with placeholder card; comment out agenda data
- `src/components/Travel.tsx` — replace hotel button with call-the-hotel block
- `src/components/Footer.tsx` — year update
- `src/index.css` — any new keyframes for countdown ring/pulse animations
- `src/pages/Index.tsx` — no structural changes expected

**Files NOT modified:**
- `RegisterModal.tsx`, `Register.tsx` — deferred to next phase
- `Navigation.tsx`, `About.tsx`, `ImageCarousel.tsx`, `SpeakerFlipCard.tsx` — no changes needed (SpeakerFlipCard kept in repo for re-use)

**Things you'll need to provide after I build:**
1. Hype video MP4 → drop into `/public/lovable-uploads/` and tell me the filename
2. Fairfield Inn & Suites Austin Buda phone number + website URL
3. Confirm/correct the placeholder 2026 target date for the countdown once known

