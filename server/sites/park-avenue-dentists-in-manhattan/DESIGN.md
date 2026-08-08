---
name: Park Avenue Dentists
description: Ivy League cosmetic & restorative digital dentistry on Park Avenue, Manhattan.
colors:
  primary: "#b59367"
  secondary: "#0e1822"
  neutral-bg: "#faf8f5"
  neutral-text: "#1c222e"
  neutral-bg-dark: "#090b0e"
  neutral-text-dark: "#f1f3f5"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "12px"
  lg: "24px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "#ffffff"
    rounded: "9999px"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
---

# Design System: Park Avenue Dentists

## Overview

**Creative North Star: "The Editorial Sanctuary"**

Park Avenue Dental Specialists combines the precision of high-end cosmetic dentistry with the tranquil luxury of a private wellness sanctuary. The design system leverages a restrained, high-contrast palette of deep navy and rich golds, paired with editorial serif typography to convey Ivy League credentials and ultimate care.

**Key Characteristics:**
- Restrained color application, using gold as a premium highlight.
- Highly generous layout spacing to evoke breathing room and calm.
- Deep obsidian dark-mode backgrounds paired with warm ivory light-mode canvases.
- Smooth transitions and elegant micro-interactions.

## Colors

The color system uses deep, reassuring corporate blues contrasted with warm, handcrafted metallic gold accents.

### Primary
- **Park Avenue Gold** (#b59367): Used for accents, borders, icons, and highlights to express craftsmanship and prestige.

### Secondary
- **Obsidian Navy** (#0e1822): The anchor color for headers, footers, primary actions, and deep structural elements.

### Neutral
- **Warm Ivory** (#faf8f5): The standard light-mode background color.
- **Onyx Black** (#090b0e): The base dark-mode background color.
- **Charcoal Slate** (#1c222e): The main text color in light mode.

**The Golden Accents Rule.** Gold elements are utilized strictly for highlight surfaces (≤15% of page content). Overuse dilutes the prestige and risks looking gaudy.

## Typography

**Display Font:** Cormorant Garamond (with Georgia, serif fallbacks)
**Body Font:** Outfit (with sans-serif fallbacks)

### Hierarchy
- **Display** (Bold, clamp(2rem, 5vw, 4rem), 1.1): Used for main hero headers and signature statements.
- **Headline** (Semi-bold, 1.875rem (30px), 1.25): Section headers.
- **Body** (Regular, 1rem (16px), 1.6): Paragraphs.
- **Label** (Medium, 0.75rem (12px), tracking-widest, uppercase): Subheadings, badges, and small metadata.

## Layout

Generous vertical padding (`py-20` / `py-24`) is standard. Content containers use `max-w-7xl` or `max-w-5xl` for readable reading line-lengths and optimal centering on desktop screens. Breakpoints are standard mobile, tablet, and desktop (`lg:grid-cols-12`).

## Elevation & Depth

Surfacer layers are flat at rest. Depth is expressed through subtle borders (`border-gold-500/10`) and glassmorphic backdrop filters (`backdrop-blur-md bg-background/80`).

## Shapes

Form elements use comfortable rounded corners.
- Containers and major components: `rounded-2xl` (16px) or `rounded-3xl` (24px).
- Small badges, inputs, buttons: `rounded-xl` (12px) or `rounded-full` (pill shape).

## Components

### Buttons
- **Shape:** Pill shape (`rounded-full`)
- **Primary:** Obsidian Navy background, white text, uppercase text (`text-xs tracking-widest`)
- **Hover / Focus:** Golden transitions (`duration-300 hover:bg-gold-500`)

### Cards / Containers
- **Corner Style:** `rounded-2xl`
- **Background:** White with vertical gradients to soft golds.
- **Border:** `border-gold-500/10` or `border-gold-500/5`

## Do's and Don'ts

### Do:
- **Do** maintain a strict contrast ratio of at least 4.5:1 for all text.
- **Do** pair Cormorant Garamond displays with Outfit body copy.
- **Do** use uppercase label styles for secondary metadata.

### Don't:
- **Don't** use standard blue, red, or green alert colors. Use muted variations or gold/navy accents.
- **Don't** compress sections vertically. Allow at least `py-16` of breathing room.
- **Don't** use sharp, zero-radius corners unless explicitly requested.
