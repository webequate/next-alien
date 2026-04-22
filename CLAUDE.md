# Project: next-alien (Allens Aliens — allensaliens.com)

This is one of a family of 9 similar Next.js projects managed by Webequate. The projects share the same stack and architecture but are not identical.

**Purpose:** Community photo gallery site for "Allen's Aliens" collectibles spotted in the wild. Visitors can browse 374+ submitted photos in a grid, view individual posts with swipe navigation, and contact the creator via a form that sends email through Gmail SMTP.

---

## Stack

| Layer | Version | Notes |
|---|---|---|
| Node.js | 24 LTS (24.15.0) | Pinned in `.nvmrc` and `vercel.json` |
| Next.js | 16 | App Router only; Turbopack enabled |
| React | 19 | Automatic JSX runtime (`react-jsx`) |
| TypeScript | 5.x | strict mode, `moduleResolution: bundler` |
| Tailwind CSS | 3.x | PostCSS pipeline |
| ESLint | 9 | Flat config (`eslint.config.mjs`) |
| Prettier | 3.x | Integrated via `eslint-plugin-prettier` |
| Nodemailer | 8 | Contact form email (Gmail SMTP) |
| Deployment | Vercel | Node 24, no custom build command |

---

## Architecture

- **App Router only.** There is no `pages/` directory (excluded in `tsconfig.json`). All routes live under `app/`.
- **Turbopack** is the bundler for both dev and build. Do not add webpack configuration — it will be ignored and may cause errors.
- **SVG imports** are handled natively by Turbopack via `resolveExtensions` in `next.config.js`. No `@svgr/webpack` loader needed.
- **CSS `@import`** statements must appear before all `@tailwind` directives in `globals.css` — Turbopack enforces this.
- **Email** is sent via `nodemailer` (Gmail SMTP) through an App Router API route at `app/api/send-email/route.ts`.
- **All content is static.** No database or CMS. Site content lives in `data/*.json` and media in `public/media/posts/`. Pages are statically generated at build time.
- **Posts use numeric IDs**, not slugs. Dynamic routes are `[prefix]/[id]` where `id` is `post.id` cast to string. The sibling project (`next-ai`) uses string slugs — do not conflate them.
- **Facebook-origin data.** Post data was originally exported from Facebook. `lib/utils.ts` includes `decodeFBString()` and `parseAlienCaption()` helpers unique to this project.

---

## Directory structure

```
next-alien/
├── app/                          # All routes (App Router)
│   ├── layout.tsx                # Root layout: HTML shell, Header, Footer, GTM, providers
│   ├── page.tsx                  # Home page: descriptions + full post grid (sorted by id desc)
│   ├── providers.tsx             # Client-side providers (next-themes ThemeProvider, default "dark")
│   ├── icon.png                  # Favicon
│   ├── about/
│   │   └── page.tsx              # About page: business card + submission instructions + featured grid
│   ├── contact/
│   │   └── page.tsx              # Contact page: two-column form + contact details
│   ├── [prefix]/                 # Dynamic route: posts | featured | images | videos
│   │   └── [id]/
│   │       ├── page.tsx          # Server component: static params, metadata, prev/next
│   │       └── PostDetail.tsx    # Client component: media display + swipe navigation
│   └── api/
│       └── send-email/
│           └── route.ts          # POST: contact form → Nodemailer. GET: health ping
│
├── components/                   # Shared UI components
│   ├── AllensAliens.tsx          # SVG logo with Bruno Ace font (used as home link)
│   ├── BusinessCard.tsx          # Responsive two-column display of card-front/card-back images
│   ├── ContactDetails.tsx        # Static contact info (icons + text)
│   ├── ContactForm.tsx           # Contact form with honeypot, validation, submit state
│   ├── ContentFade.tsx           # Page transition animation wrapper (client)
│   ├── Copyright.tsx             # Footer copyright with dynamic year
│   ├── DownloadCV.tsx            # CV download icon button (wired but unused in current data)
│   ├── FadeIn.tsx                # CSS fade-in animation wrapper with optional delay (client)
│   ├── Footer.tsx                # Footer nav, social links, copyright, WebEquate branding
│   ├── FormInput.tsx             # Reusable labeled input field
│   ├── Hamburger.tsx             # Mobile menu toggle icon (Menu/X)
│   ├── Header.tsx                # Responsive nav with hamburger, logo, theme switcher
│   ├── Heading.tsx               # Section heading with accent-color text
│   ├── Instructions.tsx          # How-to-submit-photos instructions for the About page
│   ├── NavButton.tsx             # Left/right chevron buttons for post navigation
│   ├── PostFooter.tsx            # Additional info lines beneath a post (from parseAlienCaption)
│   ├── PostGrid.tsx              # 2-col/3-col responsive media grid with hover overlay
│   ├── PostHeader.tsx            # Post title + prev/next navigation arrows
│   ├── Social.tsx                # Maps socialLinks → SocialButton list
│   ├── SocialButton.tsx          # Individual social icon link (opens new tab)
│   ├── ThemeSwitcher.tsx         # Moon/Sun toggle using next-themes
│   └── WebEquate.tsx             # WebEquate branding link
│
├── hooks/
│   ├── useScrollToTop.tsx        # Returns scroll-to-top button JSX; shows after 400px scroll
│   └── useThemeSwitcher.tsx      # Returns [activeTheme, setTheme]; persists to localStorage
│
├── interfaces/
│   └── ContactForm.ts            # ContactForm interface (name, email, subject, message, website)
│
├── lib/
│   ├── metadata.ts               # generateBaseMetadata() and generatePostMetadata() helpers
│   └── utils.ts                  # decodeFBString(), parseAlienCaption(), getFileTypeFromExtension()
│
├── types/
│   ├── basics.ts                 # Basics and SocialLink types (matches data/basics.json shape)
│   └── post.ts                   # Post type (matches data/posts.json shape)
│
├── data/                         # Static JSON content (source of truth for all site content)
│   ├── basics.json               # Site identity: name, titles, description, abouts, social links
│   ├── posts.json                # All 374+ posts: id, creation_timestamp, title, uri, featured, order
│   └── video.json                # Legacy video list (superseded by posts.json)
│
├── styles/
│   └── globals.css               # Tailwind directives, animation keyframes, nav classes
│
├── public/
│   ├── images/                   # OG image, business card images, overlay PNGs
│   ├── assets/                   # Brand logos (WebEquate, social icons)
│   ├── media/posts/              # Post media organized by YYYYMM folder (201702–202408)
│   ├── alien.png                 # Alien favicon
│   ├── robots.txt
│   └── sitemap*.xml
│
├── scripts/
│   └── sort-sitemap.js           # Sorts sitemap.xml entries alphanumerically after generation
│
├── next.config.js                # Turbopack SVG extensions, image formats, strict mode
├── tsconfig.json                 # Target ES2022, react-jsx, @/* alias, bundler resolution
├── tailwind.config.js            # Custom palette (alien green), dark mode: class, forms plugin
├── eslint.config.mjs             # ESLint v9 flat config
├── postcss.config.js             # PostCSS for Tailwind + autoprefixer
├── .prettierrc.json              # Formatting rules
├── next-sitemap.config.js        # Sitemap generator (excludes /featured/**)
├── vercel.json                   # NODE_VERSION: 24.15.0
├── .nvmrc                        # Node 24
└── .env.template                 # Environment variable reference
```

---

## Key files

| File | Purpose |
|---|---|
| `next.config.js` | Turbopack extensions, AVIF/WebP image formats, strict mode |
| `tsconfig.json` | `jsx: react-jsx`, no `baseUrl`, `moduleResolution: bundler` |
| `eslint.config.mjs` | ESLint v9 flat config with native `@typescript-eslint` rules |
| `styles/globals.css` | `@import` first, then `@tailwind` directives |
| `.nvmrc` | Node 24 |
| `vercel.json` | `NODE_VERSION: 24.15.0` |
| `lib/utils.ts` | `decodeFBString()`, `parseAlienCaption()`, `getFileTypeFromExtension()` |
| `lib/metadata.ts` | `generateBaseMetadata()` and `generatePostMetadata()` helpers |
| `app/api/send-email/route.ts` | Contact form API handler |
| `data/basics.json` | Site identity and contact config |
| `data/posts.json` | All post content (single source of truth) |

---

## Environment variables

All variables are required in production unless marked optional. Copy `.env.template` to `.env.local` for local development.

| Variable | Required | Description |
|---|---|---|
| `GMAIL_USER` | Yes | Gmail account used as the SMTP sender |
| `GMAIL_APP_PASS` | Yes | Gmail app-specific password (not the account password) |
| `EMAIL_FROM` | Yes | `From:` address in outgoing emails |
| `EMAIL_TO` | Yes | Recipient address for contact form submissions |
| `EMAIL_CC` | No | CC address for contact form submissions |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL (`https://allensaliens.com`) — used for metadata and sitemaps |
| `NEXT_PUBLIC_ASSET_URL` | Yes | Base URL for public assets |
| `NEXT_PUBLIC_GTM_ID` | Yes | Google Tag Manager container ID (e.g. `GTM-MKBF8NR`) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |

`NEXT_PUBLIC_*` variables are embedded at build time and exposed to the browser. Never put secrets in `NEXT_PUBLIC_*` variables.

---

## Third-party services

| Service | How used |
|---|---|
| **Gmail SMTP** | Nodemailer connects on port 465 (TLS) using `GMAIL_USER` + `GMAIL_APP_PASS`. Configure a Gmail App Password — standard account passwords are rejected. |
| **Google Tag Manager** | Injected via `@next/third-parties` `<GoogleTagManager>` in the root layout. Controlled by `NEXT_PUBLIC_GTM_ID`. |
| **Vercel** | Deployment platform. No custom build command — Vercel auto-detects Next.js. Node version set in `vercel.json`. |
| **next-sitemap** | Generates `sitemap.xml` and `robots.txt` at build time via `npm run build:sitemap`. The `/featured/**` routes are excluded. Config in `next-sitemap.config.js`. |
| **react-swipeable** | Provides swipe gesture handling in `PostDetail.tsx` for multi-asset posts on mobile. |
| **sharp** | Server-side image optimization for Next.js Image component (required for Vercel deployment). |

---

## Data model

### `data/posts.json` → `types/post.ts`

Array of 374+ posts. All gallery pages read from this file — never use `video.json` for new work.

```ts
type Post = {
  id: number;                  // Unique numeric ID; also the URL segment (/posts/374)
  creation_timestamp: number;  // Unix timestamp (Facebook export origin)
  title: string;               // Raw caption: "Title - Detail 1 - Detail 2 - #allensaliens"
  uri: string | string[];      // Single file path or array for multi-asset posts
  featured?: boolean;          // Shown on About page PostGrid (/featured/[id])
  order?: number;              // Sort order within featured posts
};
```

**Important:** Posts use numeric `id` as the URL key, not a string slug. The `title` field is a raw Facebook caption string — parse it with `parseAlienCaption()` to extract a display title and additional info lines.

Media files live at `/public/media/posts/YYYYMM/[filename]`. The folder is named by the month the photo was submitted. There is no `type` field — all posts are images or videos distinguished by file extension.

### `data/basics.json` → `types/basics.ts`

Single object with site-wide identity and contact info.

```ts
type SocialLink = { name: string; handle: string; url: string };

type Basics = {
  _id: string;
  name: string;
  titles: string[];        // Currently: ["Allen's Aliens in the Wild"]
  description: string;     // Short site description / meta description
  abouts: string[];        // Paragraphs for the home page intro section
  email: string;
  socialLinks: SocialLink[];
  location: string;
  website: string;
  contactIntro: string;    // Intro text for the contact page
};
```

### `interfaces/ContactForm.ts`

```ts
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;   // Honeypot — must be empty; bots fill it in
}
```

---

## Routing

| URL pattern | Source file | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home: intro descriptions + full post grid (all posts, sorted by id desc) |
| `/about` | `app/about/page.tsx` | Business card + submission instructions + featured posts grid |
| `/contact` | `app/contact/page.tsx` | Two-column contact page |
| `/posts/[id]` | `app/[prefix]/[id]/page.tsx` | Post detail; prefix = `posts` |
| `/featured/[id]` | `app/[prefix]/[id]/page.tsx` | Same page component, filtered to featured posts |
| `/images/[id]` | `app/[prefix]/[id]/page.tsx` | Filtered to image file extensions |
| `/videos/[id]` | `app/[prefix]/[id]/page.tsx` | Filtered to video file extensions |
| `/api/send-email` | `app/api/send-email/route.ts` | POST only; GET returns health ping |

The `[prefix]` dynamic route handles all post-detail URLs. The prefix determines which filtered list is used for prev/next navigation. `generateStaticParams` pre-renders all combinations at build time.

---

## Theming

Dark mode is class-based (set on `<html>`). `next-themes` manages persistence to `localStorage` and hydration safety. The default theme is `"dark"`.

**Custom Tailwind palette — this project uses alien green, not orange:**

| Token | Value | Usage |
|---|---|---|
| `light-1` | `#f5f5f5` | Light background |
| `light-2` | `#a3a3a3` | Light secondary text |
| `light-3` | `#404040` | Light borders/dividers |
| `dark-1` | `#262626` | Dark background |
| `dark-2` | `#525252` | Dark secondary text |
| `dark-3` | `#d4d4d4` | Dark borders/dividers |
| `accent-light` | `#2fe419` | Accent color in light mode (bright green) |
| `accent-dark` | `#0fc400` | Accent color in dark mode (deeper green) |

Use `dark:` prefix variants for dark-mode styles. The `ThemeSwitcher` component guards its render with a `mounted` check to avoid hydration mismatches.

**Typography:** Bruno Ace is the display font for the logo, applied via the `.bruno` CSS class (defined in component styles, not `globals.css`). Standard body text uses the Tailwind sans stack. There is no Google Fonts `@import` in this project — the font is loaded differently from the sibling.

---

## Coding conventions

### Imports

All imports use the `@/` alias (maps to project root). No relative imports.

```ts
import basics from "@/data/basics.json";
import { Post } from "@/types/post";
import Header from "@/components/Header";
```

### Server vs client components

The default is server component. Add `"use client"` only when the component needs browser APIs, event handlers, or React hooks. Most interactive components (theme, nav, animations, post carousel) are client components.

### TypeScript

- Strict mode is on. Avoid `any` — the ESLint config allows it only in API route files.
- Type data shapes in `types/` (matching JSON structure). Put component prop interfaces inline or in `interfaces/` if reused across files.
- Use `const` assertions and tuple return types where applicable (see `useThemeSwitcher`).

### Styling

- Tailwind utility classes only — no inline styles, no CSS modules.
- Dark mode via `dark:` prefix on every element that needs it.
- Animation classes (`.fade-in`, `.fade-in-delay-*`) are defined in `globals.css` — use them via `className`; don't recreate keyframes.
- Nav class hierarchy: `.nav-primary` (desktop), `.nav-secondary` (footer), `.nav-mobile` (hamburger drawer).
- Container has responsive horizontal padding defined in `tailwind.config.js`.

### Forms

- All form state lives in client components with `useState`.
- Submit handler POSTs JSON to `/api/send-email`, reads `{ success, message }` response.
- Always include the honeypot `website` field (hidden via CSS, not `type="hidden"`).
- Reset form fields on successful submission.
- Show loading state on the submit button during the request.

### Email API route

Server-side validation mirrors client validation. The route:
1. Rejects requests with a filled honeypot field silently (returns success to confuse bots).
2. Validates all required fields and email format.
3. Escapes HTML in all user-supplied strings before embedding in the HTML email body.
4. Sends both an HTML version and a plain-text fallback.

### Animations

- Page transitions: wrap page content in `<ContentFade>`.
- Element entrances: wrap in `<FadeIn>` with optional `delay` prop.
- Scroll-to-top button: use the `useScrollToTop` hook — it returns ready-to-render JSX.
- Do not use Framer Motion — use the existing CSS animation classes in `globals.css`.

### Post media

- Single-asset posts: `uri` is a string. Multi-asset posts: `uri` is a string array.
- `PostDetail.tsx` renders nav dots and handles swipe via `react-swipeable` for multi-asset posts.
- Determine file type with `getFileTypeFromExtension()` from `lib/utils.ts`.
- Video posts render `<video>` with `poster`, autoPlay, loop, muted.
- There is no `type` field on posts — type is inferred from the file extension.

### Caption parsing (unique to this project)

Post titles in `posts.json` are raw Facebook captions in the format:
```
"Alien or no? - All Day I Dream - Denver, Colorado - #allensaliens"
```

Always parse them with `parseAlienCaption()` from `lib/utils.ts`:
- Returns `{ title: string, additional: string[] }`
- `title` is the first segment; `additional` is remaining segments (location, event, etc.)
- `PostHeader` renders the `title`; `PostFooter` renders the `additional` lines.

If a raw string needs Facebook unicode decoding first, pass it through `decodeFBString()` before `parseAlienCaption()`.

### Metadata helpers

Use `lib/metadata.ts` rather than constructing `Metadata` objects by hand:
- `generateBaseMetadata(title, description, path, imageUrl?, cardType?)` — for static pages.
- `generatePostMetadata(postTitle, postId, prefix, imageUrl?)` — for dynamic post pages.

Both return a full Next.js `Metadata` object including `alternates.canonical`, `openGraph`, and `twitter` card fields.

### SEO / metadata

Every route exports a `metadata` object or calls a helper from `lib/metadata.ts`. Required fields:

```ts
export const metadata: Metadata = {
  title: "...",
  description: "...",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/route` },
  openGraph: { ... },
  twitter: { card: "summary_large_image", ... },
};
```

---

## Component conventions

- **File names:** PascalCase matching the exported component name (`PostGrid.tsx`, not `post-grid.tsx`).
- **Hook files:** camelCase prefixed with `use` (`useScrollToTop.tsx`).
- **One component per file.** Page-scoped client sub-components (like `PostDetail.tsx`) live alongside their parent page file.
- **Props:** Inline interface or type at the top of the file. No separate props files.
- **No default export wrapping** — components are exported as `export default function ComponentName`.
- **Icons:** Use `react-icons` subpackages: `fi` (Feather), `fa` (Font Awesome), `ai` (Ant Design), `hi` (Heroicons). Import only what's used.

---

## Testing

**Stack:** Vitest + React Testing Library. Vitest uses Vite (not Turbopack) for test compilation — they coexist independently.

**Config files:**

| File | Purpose |
|---|---|
| `vitest.config.ts` | jsdom environment, globals, `@/` alias pointing to project root |
| `vitest.setup.ts` | Imports `@testing-library/jest-dom` to extend `expect` with DOM matchers |

**Running tests:**

```bash
npm test          # vitest watch mode
npm run test:run  # single run (CI)
```

**Test location:** `__tests__/` mirroring source structure (`__tests__/lib/`, `__tests__/components/`, `__tests__/hooks/`).

**What is tested:**
- `lib/utils.ts` — all three utility functions
- `lib/metadata.ts` — both metadata generators
- `hooks/useThemeSwitcher.tsx` — mount restore, class application, localStorage persistence, loop-fix proof
- `components/ContactForm.tsx` — full submission lifecycle (success, error, network failure, loading state, form reset, payload shape, honeypot)
- `components/Header.tsx` — `isActive()` logic for all nav routes, hamburger open/close
- `components/Hamburger.tsx` — click handler, SVG renders in both states
- `components/NavButton.tsx` — enabled/disabled rendering, both directions
- `components/ThemeSwitcher.tsx` — post-mount render, `setTheme` toggle
- `components/PostGrid.tsx` — caption parsing, array/string `uri`, link hrefs, alt text
- `components/FadeIn.tsx` — delay prop, default delay, className forwarding
- `components/PostHeader.tsx` — conditional prev/next links, path in hrefs

**What is not tested (purely presentational):** AllensAliens, BusinessCard, ContactDetails, ContentFade, Copyright, DownloadCV, Footer, Heading, Instructions, PostFooter, Social, SocialButton, WebEquate.

### Mocking conventions

- `next/navigation` → `vi.mock` with `usePathname: vi.fn()`
- `next/link` → simple `<a href={href}>` passthrough
- `next/image` → simple `<img src alt>` passthrough
- `next-themes` → `vi.mock` with `useTheme: vi.fn()`
- `fetch` → `vi.stubGlobal("fetch", vi.fn())`

### Known gotchas

- `ContactForm`'s submit button has a fixed `aria-label="Send Message"` that overrides its text as the accessible name. The "Sending..." loading state is only verifiable via `button.textContent`, not `getByRole({ name: /sending/i })`.
- All `ContactForm` fields are `required`. Tests that submit the form must fill every field — jsdom enforces HTML5 validation and will silently block submission otherwise. Use the shared `fillForm()` helper.
- When querying nav links in `Header` tests, scope to `.nav-primary` using `within()` — the logo link also has `aria-label="Home"` and appears first in the DOM.

---

## Commands

```bash
npm run dev            # dev server on port 6969 (Turbopack)
npm run build          # production build
npm run lint           # eslint . (ESLint v9 flat config)
npm run format         # prettier --write on all source files
npm run build:sitemap  # next-sitemap + custom sort script
npm test               # vitest watch mode
npm run test:run       # vitest single run (CI)
```

---

## What to avoid

- Do not add a `webpack()` function to `next.config.js` — Turbopack is active.
- Do not add `baseUrl` to `tsconfig.json` — deprecated in TS 6.0.
- Do not use `next/head` or `next/router` — App Router uses `export const metadata` and `next/navigation`.
- Do not use `.eslintrc.*` files — ESLint v9 reads only `eslint.config.mjs`.
- Do not use `next lint` in scripts — replaced by `eslint .`.
- Do not downgrade Node below 24 — `package.json` `engines` enforces `>=24.0.0`.
- Do not use relative imports — use the `@/` alias.
- Do not read from `data/video.json` for new features — use `data/posts.json`.
- Do not put secrets in `NEXT_PUBLIC_*` environment variables — they are embedded in the client bundle.
- Do not use Framer Motion for animations — use the existing CSS animation classes in `globals.css`.
- Do not add a `slug` field to posts — this project identifies posts by numeric `id`, not slug.
- Do not assume posts have a `type` field — type is inferred from the file extension via `getFileTypeFromExtension()`.
- Do not construct `Metadata` objects by hand in page files — use the helpers in `lib/metadata.ts`.
- Do not display raw `post.title` directly — always run it through `parseAlienCaption()` first.

---

## Upgrade history (condensed)

The following changes were made to reach the current state from a Next.js 15 / Node 22 baseline:

1. **Next.js 16 + Turbopack** — removed webpack SVG loader, added `turbopack.resolveExtensions`, fixed `globals.css` import order, set `jsx: react-jsx`.
2. **ESLint v9 flat config** — deleted `.eslintrc.*`, created `eslint.config.mjs`, changed lint script from `next lint` to `eslint .`.
3. **Security audit pass** — `nodemailer` 6→8, various ReDoS/injection fixes.
4. **Dependency refresh** — all packages to current stable, `@typescript-eslint` parser + plugin added.
5. **Dead code removal** — deleted unused components (`Layout.tsx`, `LayoutWidget.tsx`), unused state, unused variables.
6. **tsconfig cleanup** — removed redundant include paths, removed deprecated `baseUrl`.
7. **Node.js 24 LTS** — `.nvmrc`, `vercel.json`, `engines` all updated.
