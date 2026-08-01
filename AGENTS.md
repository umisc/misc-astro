## Documentation

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
- [TailwindCSS](https://tailwindcss.com/docs/installation/using-vite)

## Rules

- Avoid useEffect like the plague. Prefer separate, semantic, reusable hooks that can be shared between components. useEffect is a last resort.
- Never add lucide-react. Use phosphor icons ALWAYS.
- Work within the design system. Use shadcn components with baseui. Don't create random new conventions, ask the user if they would like to change the design system.
- Do not create global Tailwind `@layer base` or `@layer components` rules for resets, typography, focus states, selection, borders, or motion.
- Put page-level `html` and `body` styles in the layout/template. Components must declare their own focus, selection, border, transition, and reduced-motion behavior locally.
- Prefer actual React components for reusable UI patterns. For one-off styling, use the utilities at the point of use instead of creating an `@apply` class.
- Define reusable keyframes and animation tokens in the Tailwind `@theme`; never add global reduced-motion media queries. Use `motion-safe:`/`motion-reduce:` utilities or component-local motion preference logic.

# Spacing

MISC uses parent-owned spacing to keep page rhythm predictable.

- `BaseLayout` owns page-block padding.
- `Container` owns viewport gutters and max width.
- Flex/grid parents own sibling separation with `gap-*`.
- Cards, dialogs, controls, and full-bleed sections own interior padding.
- Semantic roles are `page-inline`, `page-block`, `page-section`, `section`, `section-content`, `content`, and `cluster`.

Avoid routine `mt-*`, `mb-*`, `my-*`, and `space-y-*`. Keep functional margins such as `mx-auto` centering and `mt-auto` flex alignment. Mark deliberate exceptions with `data-spacing-exception="..."`.
