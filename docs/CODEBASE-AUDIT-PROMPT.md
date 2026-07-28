# PickleTagum codebase audit prompt

Copy the prompt below into a new Codex task when you want a thorough, safe review before deploying or publicly sharing PickleTagum.

```text
Audit this entire PickleTagum codebase for production readiness. It is an Astro static site deployed to Vercel, with Supabase used for the public court directory, court images, and the private `/admin` court editor.

Your goal is to make the project cleaner, safer, and easier to maintain without changing the visual design or breaking existing behaviour.

First, read the repository structure, package configuration, documentation, environment examples, Supabase SQL files, and all source files that affect the public site or `/admin`. Do not inspect, print, commit, or expose `.env`, `.env.local`, keys, tokens, or other secrets.

Audit the following areas:

1. Build and runtime reliability
   - Run the production build and report every warning or error.
   - Verify Astro routes, static assets, page metadata, favicon, script loading, and CSS asset references.
   - Confirm the public directory can load Supabase court data and fails gracefully if configuration or the network is unavailable.
   - Confirm the `/admin` page handles sign-in, unauthorised users, loading, saving, deleting, uploading images, and database errors clearly.

2. Supabase and public deployment safety
   - Review `supabase/schema.sql` and all migration/seed SQL for correctness and idempotency.
   - Check that the public site uses only the Supabase project URL and publishable/anon key; never a secret or service-role key.
   - Confirm row-level security protects write operations and storage uploads while allowing intended public reads.
   - Identify any migration the current code expects but that may not be documented.
   - Check that `.env.example` documents every required public variable, and that no real secrets are tracked by Git.
   - Review Vercel readiness: environment variable names, build command, output directory, static routing, and public asset paths.

3. Code quality and maintainability
   - Find dead files, unused components, unused styles, unused dependencies, duplicated logic, stale JSON data, and obsolete CMS/OAuth code.
   - Before deleting anything, prove it is unused with searches and explain the evidence.
   - Refactor only when it reduces real duplication or makes the code clearer. Preserve all existing features and visual behaviour.
   - Prefer small, readable components and shared helper functions over large inline scripts where practical.
   - Keep user-facing copy clear and accurate. Check for encoding issues, broken characters, misleading links, and missing accessible labels.

4. Product and public-site review
   - Check responsive behaviour on desktop, tablet, and mobile: hero, filters, court cards, coming-soon section, footer, dialogs, and admin controls.
   - Check keyboard interaction, focus states, semantic HTML, button labels, image alt text, external-link safety, and colour contrast.
   - Confirm court card content handles missing images, missing booking links, Facebook-only courts, long descriptions, indoor/outdoor combinations, and coming-soon listings.
   - Check that prices are presented as base prices and that disclaimer wording remains accurate.
   - Confirm the site does not claim affiliations, availability, pricing, or booking guarantees it cannot verify.

5. Verification and handoff
   - Make only safe, scoped fixes that are clearly supported by the audit findings.
   - Use `apply_patch` for code edits. Do not reset, overwrite, or delete user work without explicit approval.
   - Run the production build again after changes.
   - Give a concise final report with:
     - fixes made;
     - files changed;
     - checks run and their results;
     - deployment steps still required from me, if any;
     - optional improvements that you deliberately did not implement.

Do not commit, push, deploy, alter Supabase, or modify Vercel settings unless I explicitly ask you to do so. Ask before any action that could delete data, change production data, or expose the site to a new audience.
```
