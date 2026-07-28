# Supabase setup

1. In Supabase, open **SQL Editor**, create a new query, and run it.
2. For a new project, paste and run `supabase/schema.sql`.
3. For an existing project that used an earlier schema, also run these migrations once:
   - `supabase/optional-booking-link.sql` allows Facebook-only listings with no booking-site link.
   - `supabase/add-coming-soon.sql` adds the Coming soon availability option.
4. Run `supabase/seed-courts.sql` only if you want to import the starter listings.
5. In **Authentication > URL Configuration**, add your Vercel URL and `http://localhost:4321` to Redirect URLs.
6. Sign in once using the email that will administer the directory.
7. In SQL Editor, run this query after replacing the email address:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com';
```

8. In Vercel **Project Settings > Environment Variables**, add your Supabase values as:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_PUBLISHABLE_KEY`

   Add both values to the **Production** environment, then redeploy.

The publishable key is designed to be used in browser code. Never add a Supabase secret key, service-role key, database password, or any other private credential to Vercel client variables or source code.
