# Mobile Card Actions Design

## Goal

Restore expandable mobile court cards while keeping the essential venue information immediately visible.

## Approved interaction

Each mobile card starts collapsed. Its summary shows the venue area, image, court name, court-count label, and price range when available. A visible text hint communicates that booking options can be shown.

Expanding a card reveals only its booking and Facebook actions. The hint changes to communicate that the options can be hidden again. Cards begin collapsed whenever the list renders or filters update.

## Markup and accessibility

- Use native `<details>` and `<summary>` only for mobile cards.
- Put the image and all non-interactive venue information inside the summary.
- Put booking and Facebook links outside the summary, inside the expandable content. This prevents nested interactive elements.
- Preserve the existing disabled/unavailable presentation for absent links.
- Native details semantics provide keyboard activation, visible focus, and an exposed expanded/collapsed state without custom ARIA state management.
- Keep desktop cards and the desktop image-based venue-details dialog unchanged.

## Layout

Collapsed and expanded cards use the existing compact card dimensions and visual language. Court count and price range appear directly below the court name before expansion. Expanded content contains the two action controls in the existing responsive two-column layout.

## Scope

Modify only the mobile-card markup generated in `src/scripts/filter.js` and relevant mobile CSS in `src/styles/global.css`. Do not change the database, desktop layout, analytics, or dependencies.
