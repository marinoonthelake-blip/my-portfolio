# Knowledge Block: Next.js 15 & Edge Architecture

## 1. Rendering Strategy: Partial Prerendering (PPR)
**Rule:** Do not force-dynamic entire pages. Architect every route with a static shell.
- Wrap dynamic components (e.g., user dashboards) in `<Suspense>`.
- Enable `experimental: { ppr: true }` in config.

## 2. React Server Components (RSC)
**Rule:** Default to Server Components.
- **Fetching:** Fetch data directly in the component body using `await`.
- **Client Boundary:** Only use `"use client"` for interactive "leaves" (buttons, inputs).
- **No Waterfalls:** Pass data down as props; do not fetch inside `useEffect`.

## 3. Component Governance
**Rule:** All props must be validated via Zod Schemas.
- Prevent "Prop Hallucination" by defining strict interfaces.
- Style using **Tailwind** mapped to the provided W3C Tokens.