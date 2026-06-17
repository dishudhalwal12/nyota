# PRODUCT REQUIREMENTS DOCUMENT
## Nyota — Wedding Invitation Website Templates
### Build Prompt for Antigravity (VibeCoding)

---

## 0. ROLE & MANDATE

You are a senior product designer and conversion copywriter, the kind of team that charges seven figures for a single landing page. You are building the marketing website for **Nyota** — a platform that sells premium, pre-built wedding invitation **website templates** to Indian couples. Customers pick a template, customise text/photos/colors themselves, and share a live website link instead of a printed card or a WhatsApp video.

Build a single-page, scroll-driven marketing site. Tone: warm, confident, editorial, slightly premium-minimal — think a design studio's portfolio site crossed with a wedding brand. NOT a generic SaaS template. No stock-photo gradients, no purple-blue AI-startup look, no emoji-heavy copy. Every line of copy must read like it was written by a human who has actually sat through Indian weddings and listened to relatives complain about invitations.

---

## 1. BRAND FOUNDATION

**Name:** Nyota
**Tagline (primary, header):** Website Templates for Wedding Invites
**Sub-tagline:** Easy to customise. Effortless to share. Made for your big day.
**One-line positioning:** Nyota replaces printed cards and shaky WhatsApp videos with a beautiful, editable wedding website your guests will actually remember.
**Brand voice:** Warm, plain-spoken, a little wry. Short sentences. No corporate filler like "leverage," "seamless," "revolutionize." Write the way a sharp friend would explain why this is better, not the way a pitch deck would.

**Color system:**
- Background: warm off-white (#FAF8F5 or similar — not pure white, slightly creamy)
- Primary text/ink: near-black (#0E0E0E)
- Accent (used sparingly, in pill buttons / category chips border): warm charcoal outline, transparent fill
- CTA buttons: solid black pill (#111111) with white text, full rounded corners (border-radius: 999px)
- Template card colors are vivid and varied (this is intentional — the templates themselves carry the color, the site shell stays neutral)
- Use a soft 1px hairline border (#E5E1DA) for dividers and card outlines throughout — this is a recurring structural motif (see Section 3)

**Typography:**
- Headlines: a high-contrast, rounded-but-confident grotesque/serif-adjacent display font — similar character to "Söhne," "General Sans," or "Author" — bold weight, tight letter spacing, slightly large x-height. Headlines should feel "designed," not default system font.
- Body: a clean humanist sans (Inter, General Sans, or similar) at comfortable reading size (16–18px), generous line height (1.6).
- All lowercase is NOT used — standard sentence case throughout, matching reference.

**Recurring structural motif — IMPORTANT:**
Every major section is bookended by a thin horizontal hairline rule with a small pill-shaped label tab sitting on top of the left end of the line (e.g., a small rounded-rectangle outline button reading "Features," "Testimonials," "New Releases"). Implement this as a reusable `<SectionLabel>` component: a horizontal `<hr>` with a small absolutely-positioned pill badge overlapping its top-left corner. Use this before: Hero→Features transition, before Testimonials, and optionally before FAQ.

---

## 2. GLOBAL LAYOUT

- Single page, smooth-scroll, max-width content container ~1280px, generous side padding (5–8% of viewport on desktop, 24px on mobile).
- Sticky header, transparent/blended into background, becomes a subtle bordered bar on scroll.
- Fully responsive: mobile-first breakpoints at 768px and 1024px. On mobile, the hero card fan stacks/scrolls horizontally; feature rows stack to single column; comparison table becomes a stacked card list; testimonial row becomes a horizontal swipe carousel.
- Buttons: pill-shaped, solid black, white text, medium weight, generous horizontal padding (28–32px), subtle hover state (slight scale 1.02 + opacity shift on the black fill).
- Use soft drop shadows only on template preview cards (a gentle elevated-card shadow, not heavy).

---

## 3. HEADER (sticky)

- Left: Logo lockup — a small bold geometric mark (suggest a stylised star/spark icon, since "Nyota" = star) + wordmark "Nyota" in bold display type, with a small ® or ™ superscript if desired for premium feel.
- Right: Primary nav CTA pill button "Choose a template" (solid black) + a circular hamburger/menu icon button (outlined circle, 3-line icon) that opens a simple slide-down/overlay menu with: Templates, How it works, Pricing, FAQ, Contact.
- Header background: transparent over hero, gains a 1px bottom hairline + slight backdrop-blur once user scrolls past hero.

---

## 4. SECTION 1 — HERO

**Layout:** Centered text block on top, full-bleed horizontal "fanned card carousel" below it — a row of 7-8 tilted/rotated wedding invite preview cards (alternating slight rotation left/right, like a hand of cards spread out, with the center cards rotated less and the outer cards rotated more, ~-15° to +15°), each card showing a different template's mobile screenshot. Cards bleed off the left/right edges of the viewport (overflow hidden on body).

**Copy (centered, above the cards):**
- Eyebrow label (small, uppercase-tracked, gray): `Introducing`
- H1 (large, bold, two lines): `Website Templates for` / `Wedding Invites`
- Subhead (gray, medium weight, centered, max-width ~480px): `Easy to customise, effortless to share. Website templates for your big day.`
- CTA button (black pill, centered): `Choose a template`

**Below the card fan:** a thin full-width hairline rule with a small pill tab on the left reading `New Releases` (this is the SectionLabel component described in Section 2 — it visually closes the hero and opens the next section).

**Implementation notes for the card fan:** Use 7–8 `<div>` cards, each `border-radius: 16px`, fixed aspect ratio ~9:16 (phone-screenshot proportions), background a vivid illustrated scene (you can use CSS gradients + simple SVG illustration placeholders — sunset orange/pink lantern scene, deep blue night scene with a couple silhouette, emerald green scene, lilac/purple floral motif, teal scene with a vintage car). Each card has small centered text overlay (e.g., a couple's first names in a script/serif font) to simulate a real invite design. Apply `transform: rotate(Ndeg) translateY(Npx)` per card to create the fan, with the two center cards flattest and largest, tapering outward.

---

## 5. SECTION 2 — TEMPLATE GALLERY / "DESIGNED FOR YOUR BIG DAY"

**Copy:**
- H2 (centered, two lines): `Designed for your big day. Easy to edit.` / `Effortless to share.`
- Subhead (centered, gray): `Pick a style. Add your story. Share in minutes.`

**Category filter row:** centered row of pill-shaped filter chips (outlined, not filled, black text, hairline border, active state = filled black/white text):
`All` · `Hindu Weddings` · `Christian Weddings` · `Sikh Weddings` · `Muslim Weddings` · `South-Indian Weddings` · `Save the Date`

**Template card grid (below filters):** Responsive grid (3 columns desktop / 1 column mobile) of template preview cards. Each card contains:
- A small browser/device frame mockup showing the template's live preview (illustrated scene + couple names)
- Two small circular icon buttons top-left on the preview (a "color variant" swatch icon and a price/currency icon) and one circular icon top-right (an "eye" preview icon)
- Below the preview: template name (bold, e.g., `Laavan`), price pill on the right (black pill, e.g., `INR 3999`)
- One-line description in gray: e.g., `Perfect for Sikh weddings — effortless to edit, share. Designed to feel completely yours.`
- A small category tag pill at the bottom (outlined, e.g., `Sikh Weddings`)

**Content requirement — generate at least 6 real template entries** (do not leave placeholders), each tied to a category, with an authentic-sounding template name (Indian wedding-ritual or poetic words), a real price between ₹2,499–₹4,999, and a genuine one-line description. Example set to use or expand on:
1. **Laavan** — Sikh Weddings — ₹3,999 — "Perfect for Sikh weddings — effortless to edit, share. Designed to feel completely yours."
2. **Mandap** — Hindu Weddings — ₹3,499 — "Built around the rituals that matter — mandap, mantras, and all."
3. **Nikah Nama** — Muslim Weddings — ₹2,999 — "Elegant, understated, and true to tradition — for your nikah invite."
4. **Vow & Veil** — Christian Weddings — ₹2,799 — "A clean, romantic template for church weddings and receptions."
5. **Thirumanam** — South-Indian Weddings — ₹3,299 — "Inspired by South-Indian wedding motifs — kolam patterns, temple gold, and warmth."
6. **The Route** — Save the Date — ₹2,499 — "A playful save-the-date with a built-in map — because half your guests will ask for directions anyway."

---

## 6. SECTION 3 — FEATURES ("THE WEDDING INVITE, REINVENTED")

**Section label tab:** `Features` (hairline + pill, per Section 2 global motif)

**Layout:** Two-column. Left column (sticky on desktop): large H2 + subhead + CTA button. Right column: a vertically stacked list of feature rows, each separated by a hairline divider, each row containing a small icon-illustration on the left and label + bold headline on the right.

**Left column copy:**
- H2: `The Wedding Invite, Reinvented.`
- Subhead (gray): `Mobile-first, effortless to share. Costs less than printed cards, but feels far more premium.`
- CTA: `Choose a template` (black pill)

**Right column — feature rows (use exactly these six, written in this register):**
1. Icon: piggy bank. Label: `Cost`. Headline: `Cheaper than most WhatsApp and printed invites *`
2. Icon: magnifying glass. Label: `Elder-Friendly Design`. Headline: `No more squinting at tiny, blurry WhatsApp videos`
3. Icon: camera. Label: `Pre-Wedding Highlight`. Headline: `Showcase your shoot like never before`
4. Icon: rotary dial / instant-update symbol. Label: `Instant Edits`. Headline: `Any change? Update anything instantly, even after sharing`
5. Icon: Ganesh idol / auspicious figurine. Label: `Ritual-Ready Templates`. Headline: `Includes deities and editable mantras (Hindu weddings only)`
6. Icon: padlock. Label: `Private Event Pages`. Headline: `Invite different guests to different events`

(Footnote text near feature 1, small gray: `* Based on average printed card and premium WhatsApp video invite pricing in metro cities.`)

---

## 7. SECTION 4 — HOW IT WORKS

**Copy:**
- H2 (centered): `Create a Stunning Wedding Invite Website in 10 Minutes`
- Subhead (centered, gray): `Easily change everything — text, photos, layout, colors — and make your love story the star.`

**Three-step card row** (3 columns desktop, stacked mobile), each a bordered rounded card with a step number + title + description, with the middle card additionally showing a small floating UI mockup (a panel showing editable text fields like "Name 1: ABHISHEK", "Name 2: KANIKA" overlapping the template preview, to visually demonstrate live editing):
1. `1 — Choose a template` — `Choose a design that fits your wedding aesthetic.`
2. `2 — Customise & Publish` — `Add your story, event details, hit publish.`
3. `3 — Share anywhere` — `Share your invite with friends and family.`

Below the row: centered CTA button `Choose a template`.

---

## 8. SECTION 5 — COMPARISON TABLE

**Copy:**
- H2 (centered): `What Cards and Video Invites Can't Do (But These Templates Can)`
- Subhead (centered, gray): `See how your invite can go from a one-time share to a lasting experience — without extra cost or hassle.`

**Table** (4 columns: row label, "Printed Cards", "WhatsApp Videos", "Nyota" — last column emphasized in bold black, first two columns in muted gray text):

| | Printed Cards | WhatsApp Videos | Nyota |
|---|---|---|---|
| Cost | High | Moderate | **Low** |
| Customization | Limited | Hard | **Easy** |
| Interactivity | Static | View-only | **Responsive** |
| Updating | Impossible | Difficult | **Instant** |

Each row has a small icon to the left of the row label (rupee symbol for Cost, pencil for Customization, fingerprint for Interactivity, refresh-arrow for Updating). Hairline dividers between rows. Below table: centered CTA `Choose a template`.

---

## 9. SECTION 6 — TESTIMONIALS

**Section label tab:** `Testimonials`

**Copy:**
- H2 (centered): `Don't Take Our Word for It — Here's What Real Couples Are Saying`
- Subhead (centered, gray): `One link. Endless compliments.`

**Layout:** Horizontal scrolling row of photo-cards (couple photos as background, dark gradient overlay at bottom for text legibility), each card showing a quote (italicized key phrase) + name + relationship-to-couple tag. Use real-feeling Indian names and natural phrasing — write at least 6 unique testimonials in this exact tone (slightly breathless, casual, text-message-like):

1. "This invite is SO beautiful I'm lowkey jealous. The detailing, the colors, everything is so elegant. When Shweta told me it was a template she customised herself, I was like WHAT." — **Riya and Sai** (Bride's friends)
2. "My uncle actually called to ask 'where did you get this invite from?' That never happens." — **Saurab and Tamanna** (Bride and Groom)
3. "My god, I have never seen a wedding invite this pretty. Nyota = 100/10" — **Jatin and Monika** (Groom's and sister-in-law)
4. "Where did you get this invite from 😍?" was the most common question." — **Amisha and Bharat** (Groom's brother and sister-in-law)
5. "Honestly, it was actually easier than Canva, and way more premium than a WhatsApp video." — **Sidhant and Roshni** (Bride's friends)
6. "Absolutely stunning. Half of our relatives saved it just to look at it again later." — **Karan and Diya** (Groom's cousins)

---

## 10. SECTION 7 — FAQ

**Copy:**
- H2 (centered): `Questions? Answers.`

**Accordion list** (single column, max-width ~700px, centered), each row a hairline-bordered accordion item with a `+` icon that rotates to `×` on expand. Write real, useful, plain-language answers (2-3 sentences each, no fluff) for these questions — DO NOT reference "Framer" since this is being built standalone, replace generically:

1. **Do I need any software to edit these templates?** — No. Everything is edited directly in your browser through a simple visual editor — no design software or coding required.
2. **Will this open like a website?** — Yes. Every template becomes a real, mobile-friendly website with its own shareable link.
3. **What if I want to split guests by event?** — You can create private event pages and share different links with different guest groups — for example, a separate page for the sangeet versus the wedding ceremony.
4. **How do I get started?** — Pick a template, complete payment, and you'll get instant access to the editor to start customising.
5. **How long does it take to edit the invite?** — Most couples finish customising in under 15 minutes — just add your names, photos, and event details.
6. **What happens after I buy the template?** — You'll receive an editor link by email where you can personalise your invite and publish it whenever you're ready.
7. **Can I purchase now and use it later?** — Yes, your template and editor access don't expire — customise and publish whenever you're ready.
8. **Can I purchase it using my phone?** — Yes, the entire purchase and editing experience works smoothly on mobile.
9. **Is there an expiry to the template?** — No, once purchased, your invite stays live and editable for as long as you need it.
10. **Will I need to buy a domain name?** — No. Every invite comes with a free shareable link — a custom domain is optional, not required.
11. **How do I add my details in the template?** — Simply click on any text, photo, or section in the editor and replace it with your own details.
12. **Can I add music?** — Yes, most templates support a background audio track that plays when guests open your invite.
13. **What's included in the template?** — Each template includes the full website design, editable text and photo sections, and a free shareable link.
14. **Do I need to know coding to use this?** — Not at all. The editor is fully visual — point, click, and type.
15. **How do I share this with my guests?** — Once published, you'll get a single link you can share over WhatsApp, SMS, or email.
16. **How do my guests view the invite?** — They simply open the link in their browser — no app download required.
17. **Can I preview before I share it?** — Yes, you can preview your finished invite as many times as you like before sharing.
18. **Can I make changes after sharing?** — Yes, any edits you make update instantly, even on links you've already shared.
19. **Do you make custom invites?** — Currently we focus on ready-to-edit templates, but reach out if you have a custom request.
20. **Can I re-sell these templates?** — No, templates are licensed for personal use for your own event only.
21. **What's the refund policy?** — Since access is granted instantly, we don't offer refunds once the editor link has been delivered — please review the template preview carefully before purchasing.

Below accordion: centered black pill button `Any other question? Email Us`.

---

## 11. SECTION 8 — NEWSLETTER

**Copy:**
- H2 (centered): `Be the first to know when a new template drops`
- Subhead (gray, centered): `Stay updated on new templates and feature releases.`
- Input field (underline-style, not boxed): placeholder `Email address`
- Button below input: `Subscribe` (black pill)

---

## 12. FOOTER

**Layout:** Top hairline divider. Four-zone layout:
- Column 1: Large brand line `Website Templates for Wedding Invites` (wraps to 3 lines, bold display type)
- Column 2: `Need any help? We've got your back.` + email `hello@nyota.design` + small circular social icons (Instagram, YouTube)
- Column 3: `Information` heading + links: `About Us`, `Contact us`, `Privacy Policy`, `Refund Policy`, `Terms`
- Column 4 (right-aligned card, bordered rounded box): mini-CTA card with headline `Invite Your Guests in 10 Minutes!`, subtext `Choose. Customise. Share.`, black pill button `Choose a template`, and a small illustration of a couple in traditional wedding attire anchored to the bottom-right of the card.

**Bottom bar:** logo mark (left) + `© Nyota 2026` (right) + small repeated logo icon (far right), separated from the columns above by a hairline.

---

## 13. TECHNICAL REQUIREMENTS

- Build as a single responsive HTML/CSS/JS page (or React if the tool defaults to it) — no backend required for this version, all CTAs can route to a placeholder `/templates` anchor or page.
- Use semantic HTML5 (`<header>`, `<section>`, `<footer>`, proper heading hierarchy h1→h2→h3).
- All images/illustrations can be built as inline SVG or CSS-gradient placeholder cards — do not use copyrighted artwork, stock photography of real people, or any existing brand's template designs. Generate original illustrated scene placeholders (gradient + simple shapes) for the template preview cards and original icon illustrations (simple flat/3D-style icons) for the feature section.
- Smooth scroll behavior, fade/slide-up entrance animations on scroll for each section (subtle, 400-600ms, no bounce).
- Accordion FAQ must be fully functional (expand/collapse, only one open at a time is optional).
- Category filter chips in the template gallery must actually filter the visible template cards by category (client-side filter, no page reload).
- Ensure color contrast passes basic accessibility (dark text ≥ 4.5:1 against the cream background).
- Do not add a cookie banner, chat widget, or any element not specified above.

---

## 14. WHAT NOT TO DO

- Do not use purple/blue gradient "AI startup" aesthetics.
- Do not use generic stock-photo hero images.
- Do not write generic SaaS copy ("Empower your special day with our seamless platform"). Every sentence should sound like it was written by a person who has actually planned an Indian wedding.
- Do not reference any competitor or existing product by name anywhere in the copy or code comments.
- Do not leave any placeholder "Lorem ipsum" text — every section must ship with the real, final copy specified above.

---

**End of PRD. Build this in one pass, section by section, in the order listed above.**