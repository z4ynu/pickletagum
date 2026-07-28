# PickleTagum interaction animation plan

## Goal

Make the directory feel responsive and alive without slowing browsing down or distracting from court information. Motion should explain what changed after a user action, not decorate every element.

## Principles

- Keep most transitions between 150ms and 280ms.
- Prefer opacity, transform, and colour transitions for smooth performance.
- Do not animate layout in a way that causes content to jump unexpectedly.
- Respect `prefers-reduced-motion` by disabling non-essential motion.
- Keep all controls usable immediately; animations must never delay taps, links, or keyboard actions.

## Planned interactions

| Feature | Interaction | Animation | Target behaviour |
| --- | --- | --- | --- |
| Search and filters | Enter a search or choose an area/court type | Matching cards fade up very slightly; inactive cards are replaced without a page jump | 180–280ms; no spinner after the initial load |
| Filter chips | Tap a chip | Quick background, text-colour, and scale transition | 150ms; selected chips remain clearly visible |
| Mobile area dropdown | Open or close the area selector | Chevron rotates and choices fade/slide into place | 180ms; selected area closes the dropdown automatically |
| Disclaimer | Close the banner | Fade out and collapse vertically | 180–220ms; avoid abrupt removal |
| Court cards | Hover or focus on desktop | Small upward lift and soft shadow | 160ms; no movement on mobile tap |
| Mobile court row | Expand or collapse a venue | Details fade down below the compact row | 180–220ms; the thumbnail remains stable |
| Image and notes modal | Open or close image details | Backdrop fades; modal rises and scales slightly | 200ms; focus moves into the modal immediately |
| Booking/Facebook buttons | Hover, focus, or press | Slight shade change and 1px lift | 150ms; maintain strong focus outline |
| Loading courts | First page load | Three subtle skeleton cards shimmer | Stop immediately when data or an error state appears |
| Grid/List switcher | Change desktop layout | Cards fade in after the layout changes | 200ms; do not animate every card position individually |

## Implementation order

1. Keep the existing loading skeleton, filter-chip, card-entry, mobile details, and modal transitions.
2. Add a dismiss animation to the disclaimer before removing it from the page.
3. Add a small fade transition when Grid/List changes.
4. Test filters, mobile expansion, modal focus, and external links with keyboard navigation.
5. Test desktop, tablet, and mobile widths with reduced-motion enabled and disabled.

## Accessibility checklist

- Use `@media (prefers-reduced-motion: reduce)` to reduce or remove animations.
- Never use motion as the only indication of an active filter, expanded card, or modal state.
- Keep visible focus indicators on every interactive element.
- Move focus to the modal when it opens and return focus to the triggering image when it closes.
- Ensure animation timing does not prevent screen readers from announcing updated result or error states.

## Avoid

- Continuous floating, bouncing, spinning, or autoplay animations.
- Large parallax effects on mobile.
- Delaying page content while skeletons are visible.
- Animating height or position of every card during filtering.
- Sound effects or flashing/high-contrast motion.
