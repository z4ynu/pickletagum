# PickleTagum

An independent directory of pickleball courts in Tagum City. The public site lists courts and links visitors to each venue's own booking or Facebook page. PickleTagum does not accept bookings or payments.

## Local development

1. Install Node.js LTS and enable Corepack once:

   ```powershell
   corepack enable
   ```

2. Install dependencies and start the site:

   ```powershell
   pnpm install
   pnpm dev
   ```

3. Open the local URL Astro prints, normally `http://localhost:4321`.

## Environment variables

Create `.env.local` from `.env.example` and provide your Supabase project URL and publishable key. Do not commit `.env.local`, and never use a Supabase secret or service-role key in this site.

To enable the optional availability assistant, also add `GEMINI_API_KEY`. This is server-only: do not give it a `PUBLIC_` prefix and never place it in browser code. The assistant checks public information only; it does not make reservations, payments, or guarantee a court is available.

## Court management

After completing [the Supabase setup guide](docs/SUPABASE-SETUP.md), sign in at `/admin` with an approved editor email address. Courts, photos, Facebook links, booking links, and Coming soon listings are managed there.

## Deploying to Vercel

1. Import the GitHub repository into Vercel.
2. Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the Production environment.
3. To enable the availability assistant, add `GEMINI_API_KEY` (and optionally `GEMINI_AVAILABILITY_MODEL`) to the Production environment.
4. Vercel will use `pnpm build` and publish Astro's `dist` output automatically.
5. Add the deployed Vercel URL to Supabase Authentication Redirect URLs.

Before each release, run:

```powershell
pnpm build
```
