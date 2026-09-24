create extension if not exists pgcrypto;

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

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year integer,
  engine text,
  registration_number text not null unique,
  vin text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_records (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  service_date date not null,
  mileage integer,
  category text not null default 'Periodinis aptarnavimas',
  customer_complaint text not null default '',
  work_performed text[] not null default '{}',
  parts_used jsonb not null default '[]'::jsonb,
  materials_used text[] not null default '{}',
  public_notes text not null default '',
  internal_notes text not null default '',
  performed_by text not null default 'AutoUP',
  verified_by_autoup boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_registration_number_idx on public.vehicles (registration_number);
create index if not exists vehicles_vin_idx on public.vehicles (vin);
create index if not exists service_records_vehicle_date_idx on public.service_records (vehicle_id, service_date desc);

alter table public.work_schedule enable row level security;
alter table public.bookings enable row level security;
alter table public.vehicles enable row level security;
alter table public.service_records enable row level security;

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

drop policy if exists "Public can view vehicles" on public.vehicles;
create policy "Public can view vehicles"
  on public.vehicles for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage vehicles" on public.vehicles;
create policy "Admins can manage vehicles"
  on public.vehicles for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can manage service records" on public.service_records;
create policy "Admins can manage service records"
  on public.service_records for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can view service record public fields"
  on public.service_records;
create policy "Public can view service record public fields"
  on public.service_records for select
  to anon
  using (true);

revoke all on public.service_records from anon, authenticated;
grant select (
  id,
  vehicle_id,
  service_date,
  mileage,
  category,
  customer_complaint,
  work_performed,
  parts_used,
  materials_used,
  public_notes,
  performed_by,
  verified_by_autoup
) on public.service_records to anon;
grant select on public.service_records to authenticated;
grant insert on public.service_records to authenticated;
grant update on public.service_records to authenticated;
grant delete on public.service_records to authenticated;

drop view if exists public.public_vehicle_service_records;
create view public.public_vehicle_service_records
with (
  security_barrier = true,
  security_invoker = true
)
as
select
  id,
  vehicle_id,
  service_date,
  mileage,
  category,
  customer_complaint,
  work_performed,
  parts_used,
  materials_used,
  public_notes,
  performed_by,
  verified_by_autoup
from public.service_records;

revoke all on public.public_vehicle_service_records from anon, authenticated;
grant select on public.public_vehicle_service_records to anon, authenticated;

comment on table public.bookings is 'AutoUp klientų rezervacijos';
comment on table public.work_schedule is 'AutoUp darbo dienų išimtys';
comment on table public.vehicles is 'AutoUp transporto priemonių sąrašas';
comment on table public.service_records is 'AutoUp automobilio istorija ir techninės priežiūros įrašai';
