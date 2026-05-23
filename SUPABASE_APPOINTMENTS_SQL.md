# Supabase: appointments table + RLS + policies

Paste this into the Supabase SQL editor (Database → SQL Editor).

## 1) Create/replace the appointments table

> Notes:
> - Your frontend uses: `appointment_date`, `appointment_time`, `status`, `dentist`, `notes`, `dentistNotes`, `finishedDate`.
> - Your frontend also filters by `email`.

```sql
-- (Optional) Use the public schema
-- set search_path = public;

-- Create table if it doesn't exist
create table if not exists public.appointments (
  id bigserial primary key,

  -- Required by your checklist
  name text not null,
  email text not null,
  phone text,
  service text not null,
  appointment_date date not null,
  appointment_time time not null,

  -- UI-compat columns (needed because your current frontend reads/writes them)
  status text not null default 'Confirmed',
  dentist text,
  notes text,
  dentistNotes text,
  finishedDate timestamptz,

  -- created timestamp
  created_at timestamptz not null default now(),

  -- Helpful uniqueness / ordering keys (optional)
  -- userId bigint,

  -- Extra: keep created_at consistent
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

## 3) Policies: allow anonymous INSERT and SELECT

Because your current app is a **static client** (no Supabase Auth flow) and you need cross-device syncing,
we allow anonymous reads/writes.

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

-- (Optional but recommended) Allow anonymous UPDATE/DELETE
-- Only add these if your frontend updates appointment status/notes directly.
-- Your current frontend DOES update:
--   - status changes
--   - dentistNotes + finishedDate
--   - cancel appointment (delete)
-- If you do not want open updates/deletes later, remove these policies and
-- implement admin-only auth. For now, keep them working end-to-end.

create policy "appointments_anonymous_update"
on public.appointments
for update
to anon
using (true)
with check (true);

create policy "appointments_anonymous_delete"
on public.appointments
for delete
to anon
using (true);
```

## 4) (Optional) Indexes for performance

```sql
create index if not exists idx_appointments_created_at on public.appointments (created_at desc);
create index if not exists idx_appointments_email on public.appointments (email);
create index if not exists idx_appointments_status on public.appointments (status);
create index if not exists idx_appointments_dentist on public.appointments (dentist);
create index if not exists idx_appointments_date on public.appointments (appointment_date);
```

## 5) Verify policies (sanity check)

In SQL editor, you can run:

```sql
select count(*) from public.appointments;
```

You should be able to view results from the dashboards after the deployment.

