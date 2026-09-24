-- Demonstraciniai ABC123 duomenys.
-- Šis failas skirtas tik testavimui ir gali būti paleistas pakartotinai.
-- VIN DEMOAUTOUPABC1231 yra techniškai 17 simbolių, bet yra aiškiai demonstracinis.

insert into public.vehicles (
  registration_number,
  vin,
  make,
  model,
  year,
  engine
)
values (
  'ABC123',
  'DEMOAUTOUPABC1231',
  'BMW',
  'X5',
  2020,
  '3.0'
)
on conflict (registration_number) do update
set
  vin = excluded.vin,
  make = excluded.make,
  model = excluded.model,
  year = excluded.year,
  engine = excluded.engine,
  updated_at = now();

do $$
declare
  demo_vehicle_id uuid;
begin
  select id
    into demo_vehicle_id
  from public.vehicles
  where registration_number = 'ABC123';

  insert into public.service_records (
    vehicle_id,
    service_date,
    mileage,
    category,
    customer_complaint,
    work_performed,
    parts_used,
    materials_used,
    public_notes,
    internal_notes,
    performed_by,
    verified_by_autoup
  )
  select
    demo_vehicle_id,
    date '2026-09-18',
    184250,
    'Periodinis aptarnavimas',
    '',
    array[
      'Pakeista variklio alyva',
      'Pakeistas alyvos filtras',
      'Pakeistas oro filtras',
      'Pakeistas salono filtras'
    ]::text[],
    '[
      {"name": "Variklio alyva 5W-30 – 5 l", "location": ""},
      {"name": "Alyvos filtras", "location": ""},
      {"name": "Oro filtras", "location": ""},
      {"name": "Salono filtras", "location": ""}
    ]'::jsonb,
    '{}'::text[],
    '',
    'DEMO: įrašas skirtas testavimui.',
    'AutoUP',
    true
  where not exists (
    select 1
    from public.service_records
    where vehicle_id = demo_vehicle_id
      and service_date = date '2026-09-18'
      and mileage = 184250
      and category = 'Periodinis aptarnavimas'
  );

  insert into public.service_records (
    vehicle_id,
    service_date,
    mileage,
    category,
    customer_complaint,
    work_performed,
    parts_used,
    materials_used,
    public_notes,
    internal_notes,
    performed_by,
    verified_by_autoup
  )
  select
    demo_vehicle_id,
    date '2026-07-03',
    177800,
    'Stabdžių sistemos remontas',
    'Stabdant jaučiama vibracija.',
    array[
      'Patikrinta stabdžių sistema',
      'Pakeisti priekiniai stabdžių diskai',
      'Pakeistos priekinės stabdžių kaladėlės'
    ]::text[],
    '[
      {"name": "Priekiniai stabdžių diskai", "location": "Priekis"},
      {"name": "Priekinės stabdžių kaladėlės", "location": "Priekis"}
    ]'::jsonb,
    '{}'::text[],
    '',
    'DEMO: įrašas skirtas testavimui.',
    'AutoUP',
    true
  where not exists (
    select 1
    from public.service_records
    where vehicle_id = demo_vehicle_id
      and service_date = date '2026-07-03'
      and mileage = 177800
      and category = 'Stabdžių sistemos remontas'
  );

  insert into public.service_records (
    vehicle_id,
    service_date,
    mileage,
    category,
    customer_complaint,
    work_performed,
    parts_used,
    materials_used,
    public_notes,
    internal_notes,
    performed_by,
    verified_by_autoup
  )
  select
    demo_vehicle_id,
    date '2026-04-14',
    169400,
    'Važiuoklės remontas',
    'Pašaliniai garsai priekinėje važiuoklėje.',
    array[
      'Atlikta priekinės važiuoklės patikra',
      'Pakeistas dešinės pusės šarnyras',
      'Pakeistas vairo traukės antgalis',
      'Pakeista stabilizatoriaus traukė'
    ]::text[],
    '[
      {"name": "Šarnyras", "location": "Priekis – dešinė"},
      {"name": "Vairo traukės antgalis", "location": "Priekis – dešinė"},
      {"name": "Stabilizatoriaus traukė", "location": "Priekis"}
    ]'::jsonb,
    '{}'::text[],
    '',
    'DEMO: įrašas skirtas testavimui.',
    'AutoUP',
    true
  where not exists (
    select 1
    from public.service_records
    where vehicle_id = demo_vehicle_id
      and service_date = date '2026-04-14'
      and mileage = 169400
      and category = 'Važiuoklės remontas'
  );
end
$$;
