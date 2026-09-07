create table if not exists public.work_schedule (
  scheduled_date date primary key,
  is_working boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  booking_date date not null,
  preferred_time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_date_idx on public.bookings (booking_date, preferred_time);

alter table public.work_schedule enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Public can view work schedule" on public.work_schedule;
create policy "Public can view work schedule"
  on public.work_schedule for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage work schedule" on public.work_schedule;
create policy "Admins can manage work schedule"
  on public.work_schedule for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Anyone can create booking" on public.bookings;
create policy "Anyone can create booking"
  on public.bookings for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Admins can view bookings" on public.bookings;
create policy "Admins can view bookings"
  on public.bookings for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings"
  on public.bookings for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

comment on table public.bookings is 'AutoUp klientų rezervacijos';
comment on table public.work_schedule is 'AutoUp darbo dienų išimtys';
