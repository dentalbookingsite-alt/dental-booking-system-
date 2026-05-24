# TODO (ODBS Website)

- [x] Create/verify Supabase `appointments` schema matches REQUIRED checklist column set.
  - Update `SUPABASE_APPOINTMENTS_SQL.md`

- [x] Refactor `public/script.js` to use REQUIRED schema columns.
  - Stop using legacy fields (`email`, `appointment_date/time`, `dentistNotes`, `finishedDate`, `userName`, etc.)
- [x] Update booking/finish/admin/dentist flows to load/update correctly after schema migration.

- [ ] Smoke test in browser:
  - booking insert
  - patient appointments list
  - dentist finishing flow
  - admin pending/records views

