---
name: Empathetic Civic Utility
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#904d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#f08921'
  on-tertiary-container: '#5a2e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Geist Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-bold:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Geist Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The design system for this civic-tech platform is rooted in the philosophy of **"Utility-First, Human-Centric"** design. It prioritizes clarity, democratic transparency, and extreme legibility to foster trust within micro-communities. The style is a blend of **Corporate Modern** and **Minimalism**, stripping away decorative distractions to focus on functional accessibility. 

The UI must evoke a sense of calm reliability and institutional honesty. By utilizing expansive whitespace, a crisp light-first canvas, and high-contrast elements, the design ensures that users of all digital literacy levels feel empowered and secure when managing collective community funds. The interface should feel like a "digital public utility"—unobtrusive, dependable, and essential.

## Colors

The palette is optimized for **WCAG AAA compliance**, ensuring a minimum contrast ratio of 7:1 for body copy. 

- **Primary (Emerald Growth):** Used for core actions, success states, and positive financial growth. It signifies collective prosperity.
- **Secondary (Stability Blue):** Reserved for progress indicators, information highlights, and secondary interactive elements.
- **Tertiary (Warning Amber):** Dedicated to pending states, signature requests, and items requiring attention.
- **Neutral (Slate Navy):** Provides the structural foundation. A deep slate is used for primary text to ensure maximum readability against the white background.
- **Backgrounds:** Use a pure white (`#ffffff`) for the primary canvas and a soft slate ground (`#f8fafc`) for secondary containers to provide subtle visual depth without relying on heavy shadows.

## Typography

This design system utilizes **Geist Sans** for its exceptional technical precision and readability on mobile screens. The scale is built on a **16px base** to satisfy the "Mother-Test" for accessibility.

Headings are intentionally heavy (`fontWeight: 700-800`) with tight tracking to create strong visual anchors. Body text uses a generous 1.5x line height to prevent eye fatigue during long reading sessions. For mobile devices, the `display-lg` size should scale down slightly to `28px` to maintain balanced proportions within narrow viewports.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a strict **4px/8px baseline rhythm**.

- **Desktop:** A 12-column grid with a maximum container width of `1280px`. Margins are set to `40px` with `24px` gutters.
- **Mobile:** A single-column flow (collapsing to 2 columns for small cards) with `20px` side margins. 
- **Touch Optimization:** A minimum touch target of **48px** is mandatory for all interactive elements (buttons, inputs, navigation links) to ensure usability for all ages.
- **Vertical Rhythm:** Use `lg` (24px) or `xl` (32px) gaps between major sections to maintain a "breezy" and open feel, preventing the information-dense civic data from feeling overwhelming.

## Elevation & Depth

To maintain a clean and trustworthy atmosphere, this design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Planes:** Surfaces are defined by color shifts (White to Slate-50) and hairline borders (`1px` width).
- **Outlines:** Use `#e2e8f0` (Slate-200) for borders in light mode. This provides structure without creating visual noise.
- **Shadows:** Only used sparingly on primary action cards and modals. When used, they must be "Ambient Shadows"—highly diffused, low-opacity, and slightly tinted with the neutral slate color to avoid a "dirty" look.
- **Interactivity:** On hover, elements may use a subtle scale-up (`1.02x`) or a soft glow using the primary emerald color at 5% opacity.

## Shapes

The shape language is **Rounded**, striking a balance between professional firmness and approachable friendliness. 

- **Standard Elements:** Buttons and Input fields use `rounded-xl` (0.75rem/12px) to feel modern and "soft" to the touch.
- **Containers:** Large cards and modals use `rounded-2xl` (1rem/16px) to clearly define content groupings.
- **Status Pills:** Status badges and tags use a fully "Pill-shaped" (9999px) radius to distinguish them from actionable buttons.

## Components

### Buttons
- **Height:** Minimum 48px.
- **Primary:** Solid Emerald background with White text. Bold weight.
- **Secondary:** Slate-100 background with Deep Slate text.
- **Feedback:** Must include a loading state with a spinning icon and a disabled opacity of 60%.

### Input Fields
- **Styling:** 48px height, hairline border, `rounded-xl`.
- **Labels:** Always persistent above the field; never use placeholders as the only label source.
- **Focus:** 2px ring in Emerald (`#10b981`) with a 20% opacity blur.

### Cards (Ledger & Tenders)
- **Structure:** `p-6` (24px) internal padding. 
- **Border:** 1px Slate-200.
- **Interactive:** Hover state should increase the border-color to Slate-300 or add a subtle emerald glow.

### Status Badges
- **Contextual Coloring:**
  - `Requested`: Amber background/text.
  - `Procuring`: Blue background/text.
  - `Completed`: Emerald background/text.
- **Typography:** Use `label-caps` for all badge content.

### Progress Bars (Tenders)
- **Track:** 8px height, Slate-100 background, fully rounded.
- **Indicator:** Solid Emerald fill representing the percentage of funds collected.