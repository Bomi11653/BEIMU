# BEIMU Project Instructions

## Project scope

- This repository is LEON / 郑荣成's BEIMU portfolio.
- Current baseline: P5. Preserve the existing information architecture and approved visual direction unless the user explicitly asks for a redesign.
- The site must remain statically exportable for GitHub Pages and OpenAI Sites.

## Approved architecture

- Home is a three-stage full-viewport experience: Intro → four-category directory → About / Contact.
- Work categories stay fixed: 3D 场景, AI 开发, 3D 产品动画, 新媒体视频运营.
- Category pages use a left project index with a right-aligned full-background preview fading from right to left.
- Project navigation uses the existing shutter transition and loading copy.
- About and Contact share the third home stage.
- Navigation is text-only: no pill, glass, border, or filled active background.

## Design system

- Preserve the cinematic black editorial visual system.
- Use the tokens in src/styles/design-tokens.css. Do not invent one-off font sizes when an existing type token fits.
- Chinese typography uses the CJK stack; Latin text uses --font-latin.
- Keep title, body, label, index, navigation, and micro-copy roles consistent across the whole site.
- Preserve keyboard focus, reduced-motion fallbacks, responsive layouts, and large touch targets.

## Content rules

- Do not invent brands, clients, metrics, responsibilities, tools, or project results.
- Project content is driven by src/data/portfolioCategories.ts.
- Profile, partner brands, and platform links are driven by src/data/profile.ts.
- Store project assets under public/media/works/{category}/{project-slug}/.
- Keep the partner brand area empty until LEON supplies real brand assets.
- Keep platform URLs and the WeChat QR functional when changing Contact.

## Engineering rules

- Use TypeScript and React functional components.
- Reuse the current data-driven components before adding new abstractions.
- Preserve NEXT_PUBLIC_BASE_PATH handling through portfolioAssetPath for GitHub Pages.
- Do not remove output: export, trailingSlash, basePath, or assetPrefix compatibility.
- Do not force-push main. Develop on a feature branch and merge only after review.
- Before handoff, run: npm run lint, npx tsc --noEmit, npm run build:pages, and npm run build:sites.

## Key references

- docs/cursor-handoff.md
- docs/p4-content-handoff.md
- src/styles/design-tokens.css
- src/styles/p5.css
- src/styles/route-transition.css
