# BEIMU P5 Design QA

## Source visual truth

- Works: `/workspace/scratch/e4c7273c2d13/upload/d41162e9-3a0c-455b-b5a9-f7d19c477544(1).png` — 1586 × 992 px.
- About: `/workspace/scratch/e4c7273c2d13/upload/96283f64-7da6-4667-9aa3-4d1ce9817719(1).png` — 1586 × 992 px.
- Contact: `/workspace/scratch/e4c7273c2d13/upload/509ad120-7f28-4489-ad0f-0dc30eba8f17(1).png` — 1535 × 1024 px.

## Browser-rendered implementation evidence

- Works: `.qa/works-final.webp` — 900 × 618 px normalized from the 1365 × 936 browser capture.
- About: `.qa/about-final.webp` — 900 × 618 px normalized from the 1365 × 936 browser capture.
- Contact: `.qa/contact-final.webp` — 900 × 618 px normalized from the 1365 × 936 browser capture.
- Final comparisons: `.qa/works-compare-final.webp`, `.qa/about-compare-final.webp`, `.qa/contact-compare-final.webp`.
- Initial comparisons: `.qa/works-compare-initial.webp`, `.qa/about-compare-initial.webp`, `.qa/contact-compare-initial.webp`.

## Viewport and normalization

- Browser CSS viewport: 1363 × 936 CSS px.
- Browser screenshot: 1365 × 936 px at device pixel ratio 1.
- The source frames and browser captures have different aspect ratios. For a same-canvas visual comparison, both were center-cropped and resized to 900 × 618 px, then placed side by side. Crop-dependent differences at the extreme left and right edges were not treated as exact spacing errors.
- Theme/state: desktop dark theme; first 3D category active; About and Contact captured at their corresponding scroll positions inside the third home stage.

## Full-view comparison evidence

- Works preserves the selected source structure: borderless centered navigation, left project index, active/inactive rows, full-stage project image and a right-to-left black fade. The project cover focal point is intentionally anchored toward the right because the real ARK-7 cover is much wider than the reference viewport.
- About preserves the source hierarchy and proportions: centered identity, circular portrait, left metadata rail, vertical divider and bilingual biography.
- Contact preserves option 2: information rail on the left and five staggered platform UI cards on the right. The real combined About/Contact stage is vertically scrollable, so the Contact capture is a content-region state rather than a separate route.

## Focused region comparison evidence

- Navigation: computed border is `0px none`; active state uses only a low-opacity fill. Chinese uses the Source Han/Noto CJK stack; explicitly English labels and passages use PingFang SC/PingFang TC with Inter as the non-Apple fallback.
- Type roles: project title 32.7 px, body 16 px with 23.2 px line height, and index 12 px at the tested viewport. All are driven by shared design tokens.
- Contact cards: after the second iteration, the WeChat caption and Behance card no longer overlap. Each linked card contains both its preview figure and its text caption in the same anchor.
- Works links: both the large preview and the left project row navigated successfully to `/works/3d-scene/ark-7` in the cloud browser.

## Comparison history

### Iteration 1

- [P2] Works cover focal point was centered and cropped too much of the intended right-side structure.
  - Fix: changed the default project cover anchor from center to `85% center`, retaining the right-to-left fade.
  - Post-fix evidence: `.qa/works-compare-final.webp`.
- [P2] Contact title wrapped to two lines and the WeChat/Behance captions overlapped.
  - Fix: bound the title to the shared identity size, kept it on one line at desktop widths, expanded the platform canvas to 15 rows and moved Behance to rows 12–16.
  - Post-fix evidence: `.qa/contact-compare-final.webp`.

## Findings

- [P3] The final ARK-7 crop remains closer than the mock because the supplied real cover is 1024 × 432 while the reference presents a taller composed crop. This is acceptable for the framework and can be eliminated later by supplying a dedicated vertical/desktop cover.
- [P3] The Contact comparison shows About as the highlighted tab because the cloud preview did not execute the client bundle; in a functioning client runtime the scroll listener changes the active tab to Contact.

## Primary interactions tested

- Large project preview → project detail route: passed.
- Project name/list row → project detail route: passed.
- GitHub card structure contains image and name in one external anchor: passed by DOM inspection.
- Pending platforms remain non-interactive until real links are added: passed by DOM inspection.
- Home Stage navigation, Contact tab scrolling, hover previews and live active-tab updates: blocked in this cloud preview.

## Console/runtime check

- The page HTML and CSS rendered successfully.
- The cloud browser refused direct requests to `/_next/static/chunks/*.js` with `ERR_BLOCKED_BY_CLIENT`. React did not hydrate in this preview, so client-only interactions could not be exercised.
- Browser logs contained only cloud-browser extension metadata errors; no application runtime error was emitted because the client bundle did not execute.

## Implementation checklist

- [x] Borderless navigation.
- [x] PingFang-first Latin stack and Source Han/Noto CJK fallbacks.
- [x] Shared title, body, navigation and index tokens.
- [x] Works image and project-name links.
- [x] Contact UI image and platform-name links when an href exists.
- [x] No invented brand or unconfirmed platform URL.
- [x] Desktop source/implementation visual comparisons.
- [x] ESLint, TypeScript, production build and Sites static build.
- [ ] Re-run client interaction QA in an environment that permits Next.js chunk execution.
- [ ] Run a browser-rendered mobile visual pass at 390 × 844 after the preview runtime issue is cleared.

final result: blocked
