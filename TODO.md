# TODO - Supabase realtime appointment sync

## Step 1 — Supabase integration (DB contract)
- [ ] Provide SQL to create `appointments` table with required columns for current UI:
  - id, name, email, phone, service, appointment_date, appointment_time, created_at
  - plus: dentist, notes, status, dentistNotes, finishedDate (to match existing UI)
- [ ] Enable RLS on `appointments`
- [ ] Add policies:
  - anonymous INSERT
  - anonymous SELECT

## Step 2 — Client code: remove localStorage appointment saving
- [ ] In `public/script.js`, remove all `localStorage.setItem('appointments', ...)`
- [ ] In `public/script.js`, remove all `localStorage.getItem('appointments')` usage for:
  - displayAppointments
  - renderRecords
  - adminLoadDashboard / loadAllAppointments
  - dentistLoadDashboard / loadDentistAppointments / loadDentistNotes / loadDentistPatients

## Step 3 — Client code: replace with Supabase calls
- [ ] Implement `supabaseSelectAppointmentsForPatient(email)`
- [ ] Implement `supabaseSelectAllAppointments()` for admin
- [ ] Implement `supabaseSelectAppointmentsForDentist(dentistName)`
- [ ] Update status/note actions to use Supabase `update()`

## Step 4 — Realtime sync
- [ ] Ensure realtime subscription refreshes UI by calling Supabase-based loaders

## Step 5 — Error handling / logs
- [ ] Wrap all Supabase operations with async/await try/catch and console logs

## Step 6 — Vercel deployment checks
- [ ] Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel
- [ ] Confirm realtime websockets work in production

## Step 7 — Testing instructions
- [ ] Cross-device test plan after deployment


