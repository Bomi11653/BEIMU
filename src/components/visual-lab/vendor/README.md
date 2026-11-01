# React Bits Metallic Paint

Source: https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Animations/MetallicPaint

Retrieved: 2026-11-01. TypeScript + CSS edition. License: MIT + Commons Clause, preserved in LICENSE.md.

Local adaptations (shader unchanged): minimum render ratio lowered from 2 to 1 so dpr=1 works on phones; canvas data-rendered attribute set after drawing and removed on context loss to control static fallback visibility; settings ref synchronization moved into an effect to satisfy React 19 Hooks lint rules.

No extra dependencies. Original BEIMU SVG is referenced without changes. Wrapper provides a CSS masked static material, reduced-motion mode and background-tab pause. Production page calls notFound().
