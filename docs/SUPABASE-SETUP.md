# Supabase setup

1. In Supabase, open **SQL Editor → New query**.
2. Paste and run `supabase/schema.sql`.
3. Paste and run `supabase/seed-courts.sql` to import the eight starter listings.
3. Go to **Authentication → URL Configuration** and add your Vercel URL and `http://localhost:4321` to Redirect URLs.
4. Sign in once using the email you want to administer the directory.
5. In SQL Editor, run this, replacing the email:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com';
```

6. In Vercel **Project Settings → Environment Variables**, add the two `PUBLIC_SUPABASE_*` values from `.env.example`, then redeploy.

The publishable key may be used in the browser; never add a secret key or database password to Vercel client variables or source code.
