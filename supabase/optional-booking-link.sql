-- Run once in Supabase SQL Editor to allow Facebook-only court listings.
alter table public.courts alter column link drop not null;
