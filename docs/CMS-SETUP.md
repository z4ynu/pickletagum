# Private court editor setup

The editor lives at `/admin`. It is backed by this GitHub repository: every publish action creates a commit to `main`, which Vercel then deploys.

## Use it locally before deployment

1. In GitHub **Settings → Developer settings → OAuth Apps**, create an OAuth App:
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/cms-auth/callback`
2. Copy the Client ID and generate a Client Secret.
3. Create `.env.local` in the project root using `.env.example` as a guide, then set:
   - `CMS_GITHUB_CLIENT_ID`
   - `CMS_GITHUB_CLIENT_SECRET`
   - `CMS_OAUTH_SECRET` — a unique random value of at least 32 bytes
   - `CMS_SITE_URL=http://localhost:3000`
4. Start the Vercel local environment (it runs both Astro and the OAuth functions):

   ```powershell
   pnpm dlx vercel@latest dev --listen 3000
   ```

5. Visit [http://localhost:3000/admin](http://localhost:3000/admin), sign in with GitHub, and edit the **Court directory** collection.

The CMS saves to the remote GitHub repository even while the editor runs locally. It does not deploy the public site.

## Switch to Vercel when the site is ready

1. Deploy the repository to Vercel and note its production URL (for example, `https://pickletagum.vercel.app`).
2. Update the GitHub OAuth App:
   - **Homepage URL:** your Vercel production URL
   - **Authorization callback URL:** `https://YOUR-VERCEL-DOMAIN/api/cms-auth/callback`
3. Copy the Client ID and generate a Client Secret.
4. In Vercel **Project Settings → Environment Variables**, set the values from `.env.example` for the **Production** environment:
   - `CMS_GITHUB_CLIENT_ID`
   - `CMS_GITHUB_CLIENT_SECRET`
   - `CMS_OAUTH_SECRET` — a unique random value of at least 32 bytes
   - `CMS_SITE_URL` — your exact production URL, without a trailing slash
5. Replace `http://localhost:3000` in `public/admin/config.yml` with your exact production URL, then commit and deploy.

## Who can edit

The `/admin` page itself is an editor shell, but GitHub authorizes every save. Only GitHub accounts with write permission to `z4ynu/pickletagum` can publish changes. Do not grant repository write access to anyone you do not want editing the directory.

## Day-to-day use

Visit `https://YOUR-VERCEL-DOMAIN/admin`, sign in with your GitHub account, open **Court directory → Courts**, then create or edit an entry and publish. Uploaded photos are stored in `public/images/courts` and a publish action updates `data/courts.json`.

For more background on the GitHub backend and external OAuth flow, see the [Decap GitHub backend documentation](https://decapcms.org/docs/github-backend/) and its [external OAuth guidance](https://decapcms.org/docs/backends-overview/).
