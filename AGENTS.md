# PickleTagum Agent Rules

- Use relevant global skills for SEO, accessibility, mobile-first design, security, privacy, Supabase, Vercel, and GitHub work.
- Invoke Superpowers only when the user explicitly writes the exact phrase `use superpowers`; otherwise, do not invoke any Superpowers workflow.
- Keep this Astro site static unless the user explicitly requests server rendering.
- Do not add analytics, trackers, cookies, third-party scripts, data collection, dependencies, folders, files, or app code unless the task requires them and the user has authorized the change.
- Treat all `PUBLIC_*` values as public. Never expose secrets, private API keys, or Supabase service-role credentials in client-side code.
- Use only Supabase publishable credentials in the browser and preserve Row Level Security for data and Storage access.
