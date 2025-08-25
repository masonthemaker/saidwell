### Saidwell UI Style Guide

This guide documents the visual and interaction patterns used across components. It is intended for other AIs and contributors to quickly build new UI that matches the existing look-and-feel.

---

## Design Principles
- **Dark, glassmorphic surfaces**: translucent layers with blur, soft borders, and subtle saturation.
- **High-contrast text**: use `text-white/90` for primary text, `text-white/60` for secondary.
- **Accent color**: `--color-main-accent` (neon yellow) for highlights and focus.
- **Soft motion**: `transition-all duration-300-500 ease-out` for hover/expand.
- **Rounded geometry**: use `rounded-xl` or `rounded-2xl` for major surfaces.
- **Consistent spacing**: `p-6` for primary containers, `p-2–p-4` for sub-elements.

Tokens live in `src/app/globals.css` and Tailwind variables. Use CSS variables (e.g., `var(--color-main-accent)`) rather than hardcoding hex.

---

## Colors and Tokens
- **App background**: `--color-app-bg: #0a0a0a` (implicit via dark theme vars)
- **Primary accent**: `--color-main-accent`
- **Status**: `--color-grassy-green`, `--color-sky-blue`, `--color-error-red`, `--color-hover-pink`, `--color-hover-tan`
- **Border/input**: `--border`, `--input` (light), overridden under `.dark` in CSS variables

Example usage:
```tsx
<div className="text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30" />
```

---

## Typography
- **Font**: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`).
- **Weight**: default `font-weight: 500` is set globally.
- **Headings**: `font-semibold`, primary text color `text-white/90`.
- **Secondary text**: `text-white/60`; subtle meta `text-white/50`.

---

## Surface Styles

### Main Content Areas
Use this for primary content panes (see `dash/MainContent.tsx`).
```tsx
<main
  className="
    absolute top-22 right-6 bottom-6 left-22 md:left-54
    transition-all duration-500 ease-out
    p-6 bg-white/3 backdrop-blur-xl backdrop-saturate-150
    border border-white/5 rounded-2xl overflow-y-auto scrollbar-hide
  "
>
  {/* content */}
</main>
```

### Glass Panel (generic)
Use for bento boxes, side panels, and compact modules.
```tsx
<div className="bg-white/3 backdrop-blur-xl backdrop-saturate-150 border border-white/5 rounded-2xl p-6" />
```

### Sub-panels / List rows
```tsx
<div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300" />
```

---

## Navigation

### Top Bar
```tsx
<div className="fixed top-0 right-0 h-16 left-48 transition-all duration-500 ease-out
  bg-white/3 backdrop-blur-xl backdrop-saturate-150 border-b border-l border-white/5
  flex items-center justify-between px-6 z-10" />
```

### Sidebar
- Width toggles between `w-16` (collapsed) and `w-48` (expanded).
- Item buttons: glass background with accent icon and hover tint.
```tsx
<Link
  className="group w-full flex items-center justify-center p-2 rounded-md
    bg-white/5 backdrop-blur-xl border border-white/20
    hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150"
>
  <Icon className="text-main-accent group-hover:text-hover-pink w-6 h-6" />
  <span className="ml-2 text-sm text-white font-semibold transition-all" />
</Link>
```

---

## Components

### Card (UI)
Use the shared `Card` and slots for consistent padding/typography.
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

### Modal (Confirmation)
```tsx
<ConfirmationModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={onConfirm}
  variant="warning" // "danger" | "warning" | "info"
  title="Delete file"
  message="This action cannot be undone."
/>
```
Visual: glass container `bg-white/10`, `backdrop-blur-xl`, `border-white/20`, `rounded-2xl` with overlay `bg-black/70`.

### Inputs (Search style)
```tsx
<input
  type="text"
  placeholder="Search..."
  className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg
    text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2
    focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40
    transition-all duration-300 backdrop-blur-sm"
/>
```

### Buttons
- Primary accent (outline glass):
```tsx
<button className="px-4 py-2 border border-[var(--color-main-accent)]/30 rounded-lg
  bg-[var(--color-main-accent)]/10 hover:bg-[var(--color-main-accent)]/20
  text-[var(--color-main-accent)] transition-all duration-300" />
```
- Neutral glass:
```tsx
<button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white
  border border-white/20 hover:border-white/30 rounded-lg text-sm font-medium transition-all duration-300" />
```
- Icon chip button:
```tsx
<button className="group p-1.5 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40
  rounded-lg border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300" />
```

### Chips / Tags
Use rounded-full with light backgrounds and subtle borders.
```tsx
<span className="px-2 py-0.5 text-xs rounded-full border
  bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border-[var(--color-main-accent)]/30">Resolved</span>

<span className="px-2 py-0.5 text-xs rounded-full border
  bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border-[var(--color-grassy-green)]/30">Success</span>

<span className="px-2 py-0.5 text-xs rounded-full border bg-white/10 text-white/80 border-white/20">$1.24</span>
```

### Metric Tiles
```tsx
<div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
  <div className="text-2xl font-bold text-[var(--color-grassy-green)] mb-1">94%</div>
  <div className="text-xs text-white/60">Success Rate</div>
</div>
```

---

## Motion and Interaction
- Use `transition-all` with `duration-300` or `duration-500` and `ease-out`.
- Hover states increase bg opacity slightly (`/5` → `/10` or `/20`) and border intensity.
- Sidebar and main panes animate with `transition-all duration-500 ease-out` when resizing.

---

## Accessibility
- Maintain sufficient contrast against glass backgrounds (use `text-white/90` for titles).
- Use `aria-label` on icon-only buttons and navigation links.
- Ensure focus styles with accent ring:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40"
```

---

## Do/Don't
- **Do** use CSS variables for colors; **don’t** hardcode hex values.
- **Do** use `bg-white/[opacity]` + `backdrop-blur-xl`; **don’t** use opaque dark boxes.
- **Do** keep borders subtle: `border-white/10` or `/20`; **don’t** use heavy borders.
- **Do** prefer `rounded-xl`/`rounded-2xl`; **don’t** mix sharp corners on glass surfaces.

---

## Quick Starters
- **Glass container**: `bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl p-6`
- **Sub item row**: `bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10`
- **Accent text**: `text-[var(--color-main-accent)]`
- **Muted text**: `text-white/60`
- **Primary heading**: `text-white/90 font-semibold`

Use these patterns to compose new components that feel native to the Saidwell UI.
