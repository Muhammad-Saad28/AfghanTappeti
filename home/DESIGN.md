---
name: Afghan Tappeti Design System
colors:
  surface: '#fef8f6'
  surface-dim: '#ded9d7'
  surface-bright: '#fef8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2f1'
  surface-container: '#f2edeb'
  surface-container-high: '#ece7e5'
  surface-container-highest: '#e6e1e0'
  on-surface: '#1d1b1a'
  on-surface-variant: '#4d453f'
  inverse-surface: '#32302f'
  inverse-on-surface: '#f5f0ee'
  outline: '#7f756e'
  outline-variant: '#d0c4bc'
  surface-tint: '#675c54'
  primary: '#160f09'
  on-primary: '#ffffff'
  primary-container: '#2c241d'
  on-primary-container: '#978a81'
  inverse-primary: '#d2c4b9'
  secondary: '#7e5714'
  on-secondary: '#ffffff'
  secondary-container: '#fec97c'
  on-secondary-container: '#78520f'
  tertiary: '#0c1115'
  on-tertiary: '#ffffff'
  tertiary-container: '#21262a'
  on-tertiary-container: '#888d92'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#efe0d5'
  primary-fixed-dim: '#d2c4b9'
  on-primary-fixed: '#221a14'
  on-primary-fixed-variant: '#4f453d'
  secondary-fixed: '#ffddb1'
  secondary-fixed-dim: '#f2be72'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#624000'
  tertiary-fixed: '#dfe3e8'
  tertiary-fixed-dim: '#c2c7cc'
  on-tertiary-fixed: '#171c20'
  on-tertiary-fixed-variant: '#42474c'
  background: '#fef8f6'
  on-background: '#1d1b1a'
  surface-variant: '#e6e1e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system is centered on the intersection of ancient craftsmanship and modern luxury. It evokes a sense of "Quiet Luxury"—where the product is the protagonist, supported by an environment that feels curated, spacious, and intellectually refined.

The visual direction combines **Minimalism** and **Editorial Design**. It leverages high-contrast serif typography and generous whitespace to mimic the experience of flipping through a high-end interior design monograph. The emotional response should be one of calm, trust, and appreciation for timeless artistry. All interface elements are secondary to the rich textures and intricate patterns of the hand-knotted rugs.

## Colors
The palette is rooted in organic, earthy tones that complement the natural dyes used in authentic rug making. 

- **Primary Text (#2C241D):** A deep, warm charcoal brown used for maximum legibility and authority.
- **Accent (#B88A44):** Antique Gold is used sparingly for call-to-actions, price points, and premium markers to signify quality without overwhelming the visual field.
- **Backgrounds:** A tiered system of Warm White (#FAF8F5) and Cream (#F5F2EC) provides a soft, non-clinical canvas that makes product photography feel integrated rather than "boxed in."
- **Status/Functional:** Use muted, low-saturation tones for success or error states to maintain the sophisticated atmosphere.

## Typography
The typography system relies on a high-contrast pairing. **Playfair Display** provides the editorial "voice," used for storytelling and headings. **Inter** provides the functional "engine," ensuring that technical details (knots per inch, material composition, pricing) remain clear and accessible.

Large display sizes should use tighter letter spacing to maintain a sophisticated "ink-on-paper" look. Labels and utility text should use increased tracking (letter-spacing) and uppercase styling to provide a clear functional distinction from narrative body text.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain the integrity of white space, while transitioning to a fluid model on mobile devices.

- **Desktop (1440px+):** 12-column grid with a 1200px or 1320px content max-width. Margins are generous (64px) to create an expensive, uncrowded feel.
- **Sectioning:** Vertical rhythm is driven by large gaps (80px to 120px) between content blocks to encourage "slow browsing."
- **Alignment:** Headlines are often centered for a formal look, or left-aligned with significant indentation for an asymmetrical editorial feel.

## Elevation & Depth
This design system uses **Tonal Layers** and **Ambient Shadows** to create a sense of tactile quality.

- **Soft Depth:** Surfaces should use very soft, elongated shadows with a low-opacity (#2C241D at 5-8%) to suggest that objects are resting lightly on the warm white background.
- **Layering:** High-level containers like Modals or Cart Drawers should use a "Glassmorphism" effect with a high-density background blur (20px+) to maintain the color context of the rugs beneath them.
- **Interaction:** Depth should increase slightly on hover for interactive cards, signaling a "lifted" state that invites a click.

## Shapes
The shape language is contemporary yet grounded. While the brand is traditional, the UI uses **Rounded (8px-12px)** corners to feel modern and approachable. 

- **Product Cards:** Use 8px radius to keep the focus on the rug's rectangular geometry.
- **Buttons & Inputs:** Use 8px radius for a consistent, architectural feel.
- **Swatches:** Color and material swatches are strictly circular to contrast against the predominantly rectangular grid.

## Components
- **Navigation:** A transparent header that transitions to a solid "Warm White" (#FAF8F5) with a subtle bottom border or soft shadow upon scrolling. Links use `label-md` styling.
- **Primary Buttons:** Solid "Dark Brown" (#2C241D) with "Warm White" text. High padding (16px 32px) and no heavy borders. Hover state involves a transition to "Antique Gold" (#B88A44).
- **Product Cards:** Minimalist design with no visible borders. The image occupies the full width of the card. Text (Title and Price) is placed below with ample padding. On hover, the image scales slightly (1.05x).
- **Input Fields:** Bottom-border only (border-bottom: 1px solid #D1CDC7) for a sophisticated, less "boxy" appearance. Focused states transition to the Accent Gold.
- **Chips/Filters:** Outlined with 1px Soft Gray, using `label-sm` typography. Selected states are filled with the Secondary Background (#F5F2EC).
- **Editorial Hero:** Full-bleed imagery with centered `display-lg` typography. Ensure a 20-30% black overlay or gradient if imagery is light to maintain text legibility.