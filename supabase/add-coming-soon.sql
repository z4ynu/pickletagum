-- Run this once in Supabase: SQL Editor → New query → Run.
-- It adds a flag for venues that are announced but not open yet.

alter table public.courts
  add column if not exists is_coming_soon boolean not null default false;
