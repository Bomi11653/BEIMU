# Split Text source

Copied from https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/SplitText/SplitText.tsx on 2026-11-01. TypeScript edition, source unchanged. License preserved in LICENSE.md in this directory.

Dependencies: gsap and @gsap/react. Wrapper uses load trigger, word splitting and four rows, without looping or hover effects. Only the type lab imports this component. Reduced motion switches to unsplit static text, including when the system preference changes while open. Production route returns notFound().
