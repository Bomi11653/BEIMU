# BEIMU Project Instructions

## Project scope

- This repository is LEON / 郑荣成's BEIMU portfolio.
- Preserve the approved black editorial visual direction; current architecture is recorded in docs/BEIMU_PROJECT_MEMORY.md.
- The site must remain statically exportable for GitHub Pages and OpenAI Sites.

## Approved architecture

- Home has five stages: HOME → ABOUT → WORKS → DOWNLOAD → CONTACT.
- WORKS and /works share category strips linking to category lists, then project details.
- Current categories: 平面海报设计, 3D 场景设计, 3D 产品动画设计, 新媒体视频剪辑, AI 开发. Read portfolioCategories.ts for actual content.
- Category pages use a left project index with a right-aligned full-background preview fading from right to left.
- Project navigation uses the existing shutter transition and loading copy.
- About and Contact use separate home stages, sharing ProfileContactStage.
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
- Preserve supplied partner brand assets; never invent new partners.
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
