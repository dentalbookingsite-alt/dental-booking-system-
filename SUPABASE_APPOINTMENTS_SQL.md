# Supabase: appointments table + RLS + policies

Paste this into the Supabase SQL editor (Database → SQL Editor).

## 1) Create/replace the appointments table

> REQUIRED checklist columns (frontend should read/write these):
> - `user_id`, `dentist_staff_code`, `appointment_datetime`, `status`
> - `user_name`, `user_email`, `user_phone`, `notes`
> - `dentist_notes`, `finished_at`, `booked_at`, `created_at`

```sql
-- (Optional) Use the public schema
-- set search_path = public;

-- Create table if it doesn't exist
create table if not exists public.appointments (
  id bigserial primary key,

  user_id text not null,
  dentist_staff_code text not null,
  appointment_datetime timestamp not null,
  status text not null default 'Confirmed',

  user_name text not null,
  user_email text not null,
  user_phone text,
  notes text,

  dentist_notes text,
  finished_at timestamptz,
  booked_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure updated_at changes
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();
```

## 2) Enable Row Level Security (RLS)

```sql
alter table public.appointments enable row level security;
alter table public.appointments force row level security;
```

## 3) Policies: allow anonymous INSERT/SELECT/UPDATE/DELETE

Because your app is a **static client** (no Supabase Auth flow), it currently uses anonymous `anon` access.

```sql
-- Anonymous INSERT (booking form)
create policy "appointments_anonymous_insert"
on public.appointments
for insert
to anon
with check (true);

-- Anonymous SELECT (admin/patient/dentist dashboards)
create policy "appointments_anonymous_select"
on public.appointments
for select
to anon
using (true);

-- Anonymous UPDATE (status updates / dentist notes / finished_at)
create policy "appointments_anonymous_update"
on public.appointments
for update
to anon
using (true)
with check (true);

-- Anonymous DELETE (cancel appointment)
create policy "appointments_anonymous_delete"
on public.appointments
for delete
to anon
using (true);
```

## 4) Indexes for performance

```sql
create index if not exists idx_appointments_created_at on public.appointments (created_at desc);
create index if not exists idx_appointments_user_email on public.appointments (user_email);
create index if not exists idx_appointments_status on public.appointments (status);
create index if not exists idx_appointments_dentist_staff_code on public.appointments (dentist_staff_code);
create index if not exists idx_appointments_appointment_datetime on public.appointments (appointment_datetime);
```

## 5) Verify

```sql
select count(*) from public.appointments;
```


