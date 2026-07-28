-- Run this once in Supabase: SQL Editor → New query → Run.

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.courts (
  id text primary key,
  name text not null,
  area text not null,
  types text[] not null check (cardinality(types) > 0),
  court_count integer not null default 0 check (court_count >= 0),
  price_range text,
  image_src text,
  image_alt text,
  booking_method text not null check (booking_method in ('pickle_hub', 'custom_site', 'facebook', 'phone')),
  link text,
  facebook_link text,
  note text not null,
  is_coming_soon boolean not null default false,
  last_verified date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.courts enable row level security;

create or replace function public.is_directory_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()) $$;

create policy "Anyone can view courts" on public.courts for select using (true);
create policy "Admins manage courts" on public.courts for all to authenticated
  using ((select public.is_directory_admin()))
  with check ((select public.is_directory_admin()));
create policy "Admins can view their own access" on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public)
values ('court-images', 'court-images', true)
on conflict (id) do nothing;

create policy "Admins manage court images" on storage.objects for all to authenticated
  using (bucket_id = 'court-images' and (select public.is_directory_admin()))
  with check (bucket_id = 'court-images' and (select public.is_directory_admin()));
