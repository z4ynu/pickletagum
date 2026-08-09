# PickleTagum Agent Rules

- Use relevant global skills for SEO, accessibility, mobile-first design, security, privacy, Supabase, Vercel, and GitHub work.
- Invoke Superpowers only when the user explicitly requests it with `use superpowers` (including a longer request that contains that phrase). Otherwise, do not invoke any Superpowers workflow.
- When Superpowers is explicitly requested, use the full relevant workflow: brainstorm and obtain design approval; create a written specification; create an isolated Git worktree when appropriate; write a detailed implementation plan; use test-driven development where feasible; perform code review and verification; and follow the branch-completion workflow.
- For substantive Superpowers feature work and bug fixes, store the approved specification and implementation plan in `docs/superpowers/` as required by the workflow. Do not create those artifacts for read-only questions, status checks, or genuinely tiny edits.
- Do not create a Superpowers worktree when it would separate related uncommitted work that must stay together, or when the user asks to work in the current checkout.
- Keep this Astro site static unless the user explicitly requests server rendering.
- Treat all `PUBLIC_*` values as public. Never expose secrets, private API keys, or Supabase service-role credentials in client-side code.
- Use only Supabase publishable credentials in the browser and preserve Row Level Security for data and Storage access.
