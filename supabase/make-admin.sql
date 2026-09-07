-- 1. Supabase Dashboard -> Authentication -> Users sukurkite administratoriaus vartotoją.
-- 2. Pakeiskite el. paštą žemiau į savo vartotojo el. paštą.
-- 3. Paleiskite šį SQL Supabase SQL Editor'yje.

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
where lower(email) = lower('IRASYKITE_SAVO_EMAIL');

-- Patikra:
select id, email, raw_app_meta_data
from auth.users
where lower(email) = lower('IRASYKITE_SAVO_EMAIL');
