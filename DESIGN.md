---
version: alpha
colors:
  ink: "#52191f"
  inkSoft: "#6f4449"
  paper: "#fffdfc"
  paperDeep: "#f8eff0"
  surface: "#ffffff"
  red: "#e30919"
  redDark: "#b90816"
  burgundy: "#52191f"
  line: "#eadfe0"
typography:
  display:
    fontFamily: "Georgia, Times New Roman, serif"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Tahoma, Arial, sans-serif"
rounded:
  control: "2px"
  circle: "999px"
spacing:
  pageDesktop: "36px"
  pageMobile: "17px"
components:
  buttons:
    radius: "2px"
  productCards:
    radius: "0px"
  inputs:
    radius: "2px"
---

## Overview
DeliverBooks is an editorial bookstore experience built around the supplied brand mark: deep burgundy typography, a clean red arch, and white space. Center El Gowaily remains the structural reference; Aquarium remains the behavioral reference for commerce, tracking, and admin workflows.

## Brand palette
- Burgundy `#52191f` is the primary ink, navigation anchor, and dark surface.
- Red `#e30919` is the single commerce/action accent and the visual echo of the logo arch.
- White `#ffffff` and warm-white `#fffdfc` keep the interface calm and spacious.
- Soft blush `#f8eff0` and hairline `#eadfe0` provide quiet section separation.

## Typography
Georgia is reserved for major editorial headings and product titles. System UI handles controls, body copy, Arabic text, and dense commerce information. The supplied DeliverBooks logo is used as the identity lockup instead of recreating the wordmark in interface text.

## Layout
Desktop preserves the established 1280px storefront width and four-column catalog rhythm. Mobile collapses to two product columns and drawer navigation. The hero uses the logo mark as a restrained identity moment rather than adding decorative effects.

## Elevation & Depth
Static content stays mostly flat with hairline borders. Shadows are soft and sparse, reserved for overlays, drawers, cards that need separation, and admin surfaces.

## Shapes
Square and near-square surfaces dominate. Buttons and inputs retain the established 2px radius. Circular shapes are reserved for utility controls and logo/mark details.

## Components
Header, announcement bar, search, product grid, collection grid, buttons, empty states, cart, checkout, tracking, and admin inherit the same brand tokens. The logo is used in the public header/footer and admin identity surfaces.

## Do's and Don'ts
- Use the supplied DeliverBooks identity consistently: burgundy + red + white.
- Keep the red accent selective; do not turn every surface into a red block.
- Preserve Center El Gowaily spacing, card proportions, and responsive behavior.
- Use honest empty and unconfigured states when real client data is missing.
- Never invent prices, delivery fees, payment methods, catalog categories, or policies.
- Do not connect or publish to Vercel during development.
- Avoid generic pill-heavy SaaS styling or an unrelated bookstore redesign.
