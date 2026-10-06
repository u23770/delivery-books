---
version: alpha
colors:
  ink: "#252924"
  inkSoft: "#454b43"
  paper: "#f7f5ef"
  paperDeep: "#eeeae0"
  surface: "#fffefa"
  olive: "#747c63"
  clay: "#bd6849"
  line: "#e5e1d7"
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
Deliver BOOKS inherits the established Center El Gowaily storefront visual system. The public experience is editorial commerce: restrained, product-led, and image-forward. Aquarium is a behavioral reference for order and tracking states, not a visual redesign source.

## Colors
The runtime source of truth is the root token block in css/style.css. Ink and paper create the primary contrast, olive structures secondary information, and clay is the main commerce accent.

## Typography
Georgia is reserved for major editorial headings and product titles. System UI handles controls, body copy, Arabic text, and dense commerce information.

## Layout
Desktop preserves the existing 1280px Center El Gowaily content width and four-column catalog rhythm. Mobile collapses to two product columns and drawer navigation. The hero preserves the same editorial composition while changing only the subject from apparel to books.

## Elevation & Depth
Static content stays mostly flat with hairline borders. Soft shadows are reserved for overlays, drawers, and limited media depth.

## Shapes
Square and near-square surfaces dominate. Buttons and inputs retain the established 2px radius. Circular shapes are reserved for utility controls and counters.

## Components
Header, announcement bar, search, product grid, collection grid, buttons, empty states, cart, and checkout inherit the Center El Gowaily contracts. Delivery must not appear operational until real zones and fees are confirmed.

## Do's and Don'ts
- Preserve Center El Gowaily spacing, palette, card proportions, and responsive breakpoints.
- Use honest empty and unconfigured states when real client data is missing.
- Keep Arabic and English content legible without moving primary controls.
- Never invent prices, delivery fees, payment methods, catalog categories, or policies.
- Do not connect or publish to Vercel during development.
- Avoid generic pill-heavy SaaS styling or an unrelated bookstore redesign.
