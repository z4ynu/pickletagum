# Mobile Card Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore collapsed-by-default, expandable mobile court cards that reveal only booking actions.

**Architecture:** `filter.js` will render a native `details` card for mobile while preserving the current desktop card markup. `global.css` will style the summary, state-dependent hint, and revealed action panel only within the mobile breakpoint.

**Tech Stack:** Astro, browser JavaScript, CSS, Supabase client-side data retrieval.

## Global Constraints

- Preserve static deployment, current Supabase schema, analytics, and dependencies.
- Keep desktop cards and the desktop venue-details dialog unchanged.
- Keep court count and price range visible before expansion.
- Keep booking/Facebook actions outside `<summary>` and preserve unavailable-action treatment.
- Use native details/summary behavior with visible focus states and no nested interactive elements.

---

### Task 1: Render an accessible expandable mobile card

**Files:**
- Modify: `src/scripts/filter.js`

**Interfaces:**
- Consumes: existing `meta`, `booking`, `facebook`, and `mobilePreview` strings in `cardMarkup(court)`.
- Produces: a collapsed `<details class="mobile-court-card">` whose `<summary>` contains venue information and whose expandable panel contains action controls.

- [ ] **Step 1: Replace mobile article markup with details/summary markup**

Make the summary contain the existing area/image header, the visible court metadata, and a non-interactive toggle hint. Put `court-actions` in a sibling content element after the summary.

- [ ] **Step 2: Verify the markup contract**

Run: `rg -n -C 2 'mobile-court-card|mobile-court-card__summary|mobile-court-card__actions|<details|<summary' src/scripts/filter.js`

Expected: mobile cards use details/summary and booking/Facebook actions are outside the summary.

### Task 2: Style collapsed and expanded mobile states

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: mobile-card classes produced by `filter.js`.
- Produces: compact collapsed cards with details visible, state-dependent text hint, and action buttons revealed only when open.

- [ ] **Step 1: Move visible metadata into the summary layout**

Ensure the court metadata appears below the name in the summary and preserve the image/header arrangement.

- [ ] **Step 2: Style the toggle hint and action panel**

Show `Show booking options` while closed and `Hide booking options` while open. Style the expanded actions with the current two-column mobile action treatment and preserve unavailable actions.

- [ ] **Step 3: Verify mobile selectors**

Run: `rg -n -C 2 'mobile-court-card__summary|mobile-court-card__toggle|mobile-court-card__actions|mobile-court-card\[open\]' src/styles/global.css`

Expected: styles are scoped to the existing mobile breakpoint and include both collapsed and open state handling.

### Task 3: Verify the integrated change

**Files:**
- Verify: `src/scripts/filter.js`, `src/styles/global.css`

- [ ] **Step 1: Check JavaScript syntax and diff cleanliness**

Run: `node --check src/scripts/filter.js && git diff --check`

Expected: both commands exit with code 0.

- [ ] **Step 2: Run the production build**

Run: `pnpm build`

Expected: Astro completes with exit code 0.

- [ ] **Step 3: Review desktop and mobile scope**

Confirm desktop card markup and dialog selectors are unchanged; at the mobile breakpoint, confirm cards begin collapsed, toggle using keyboard, and reveal only action buttons.

- [ ] **Step 4: Commit the implementation**

Run: `git add src/scripts/filter.js src/styles/global.css` followed by `git commit -m "feat: restore expandable mobile court cards"`.
