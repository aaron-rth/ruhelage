-- Ruhelage: Tabelle für den synchronisierten Lernfortschritt.
-- Einmal im Supabase-Dashboard unter „SQL Editor“ ausführen.

create table if not exists public.fortschritt (
  user_id uuid primary key references auth.users (id) on delete cascade,
  daten jsonb not null,
  aktualisiert timestamptz not null default now()
);

-- Row Level Security: jede Person sieht und ändert nur ihre eigene Zeile.
alter table public.fortschritt enable row level security;

drop policy if exists "eigene Zeile lesen" on public.fortschritt;
drop policy if exists "eigene Zeile anlegen" on public.fortschritt;
drop policy if exists "eigene Zeile ändern" on public.fortschritt;
drop policy if exists "eigene Zeile löschen" on public.fortschritt;

create policy "eigene Zeile lesen" on public.fortschritt
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "eigene Zeile anlegen" on public.fortschritt
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "eigene Zeile ändern" on public.fortschritt
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "eigene Zeile löschen" on public.fortschritt
  for delete to authenticated using ((select auth.uid()) = user_id);
