# Desktop Filter Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate and clarify PickleTagum's desktop filter controls while changing the capacity buckets to 1, 2, 3, and 4+.

**Architecture:** `FilterBar.astro` provides semantic groups and labels. `filter.js` maps the capacity buckets and preserves current selection behavior. `global.css` supplies a two-row desktop composition while retaining the mobile layout.

**Tech Stack:** Astro, browser JavaScript, CSS, Supabase client-side data retrieval.

## Global Constraints

- Keep the site statically deployed and add no dependencies or database changes.
- Preserve the existing Indoor + Outdoor multi-select behavior.
- Use native button controls with `aria-pressed` and visible focus states.
- Do not add trackers or collect user data.

---

### Task 1: Define the filter groups and capacity choices

**Files:**
- Modify: `src/components/FilterBar.astro`

**Interfaces:**
- Consumes: Existing `data-area`, `data-type`, and `data-count` selectors in `src/scripts/filter.js`.
- Produces: `data-count` values `1`, `2`, `3`, and `4+`, with accessible names that explain each numeric capacity.

- [ ] **Step 1: Update semantic labels and capacity controls**

Replace `Area`, `Court`, and `Courts` with `Location`, `Venue type`, and `Court capacity`. Replace the four current capacity labels with numeric chips: `1`, `2`, `3`, and `4+`.

- [ ] **Step 2: Check the rendered control contract**

Run: `rg -n 'Location|Venue type|Court capacity|data-count="(1|2|3|4\\+)"' src/components/FilterBar.astro`

Expected: all three group labels and exactly four capacity values appear.

### Task 2: Preserve filtering semantics with revised capacity buckets

**Files:**
- Modify: `src/scripts/filter.js`

**Interfaces:**
- Consumes: `data-count` values `1`, `2`, `3`, and `4+` from `FilterBar.astro`.
- Produces: `matchesCourtCount(courtCount)` that includes a venue when it matches any selected capacity bucket.

- [ ] **Step 1: Update the capacity matcher**

Map `1`, `2`, and `3` to exact court counts and `4+` to values greater than or equal to four. Keep the zero-selected case as a match-all condition.

- [ ] **Step 2: Check the selection paths**

Run: `rg -n -C 3 'matchesCourtCount|data-count|selectedCourtCounts' src/scripts/filter.js`

Expected: each UI value is recognized, active chips can be deselected, and selection still calls `update()`.

### Task 3: Build a readable responsive desktop layout

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `.filter-bar`, `.mobile-area-filter`, `.filter-group--area`, `.filter-group--type`, and `.filter-group--count`.
- Produces: a wrapping desktop filter layout with separate Location and secondary-filter rows, while preserving existing mobile media rules.

- [ ] **Step 1: Add focused desktop layout overrides**

At the desktop breakpoint, use a grid or wrapped layout that prevents controls from competing for one horizontal line. Keep Location as the primary group and place Venue type and Court capacity in distinct secondary groups.

- [ ] **Step 2: Verify responsive selectors**

Run: `rg -n -C 2 'filter-bar|filter-group--area|filter-group--type|filter-group--count' src/styles/global.css`

Expected: desktop-only rules separate the groups; mobile rules remain present.

### Task 4: Verify the integrated change

**Files:**
- Verify: `src/components/FilterBar.astro`, `src/scripts/filter.js`, `src/styles/global.css`

- [ ] **Step 1: Run the production build**

Run: `pnpm build`

Expected: Astro completes with exit code 0.

- [ ] **Step 2: Manually verify controls at desktop and mobile widths**

Run the local preview, then verify that desktop groups do not overlap and that Indoor + Outdoor and multiple capacity chips filter correctly. At 560px, confirm the compact horizontal chip treatment remains usable.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check && git diff -- src/components/FilterBar.astro src/scripts/filter.js src/styles/global.css`

Expected: no whitespace errors and no unrelated code changes.

- [ ] **Step 4: Commit the implementation**

Run: `git add src/components/FilterBar.astro src/scripts/filter.js src/styles/global.css` followed by `git commit -m "fix: clarify desktop court filters"`.
