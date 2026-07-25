-- ============================================================
--  Beatshelf — Politiques Row Level Security (RLS)
--  À exécuter dans Supabase : Dashboard > SQL Editor > New query > Run.
--
--  IMPORTANT : sans RLS, les filtres .eq("user_id", ...) côté client
--  ne protègent RIEN. N'importe quel utilisateur connecté pourrait
--  lire / modifier / supprimer les données des autres.
--
--  Ce script est ré-exécutable (drop policy if exists avant chaque create).
-- ============================================================

-- 1) Activer RLS sur toutes les tables --------------------------------
alter table public.likes     enable row level security;
alter table public.playlists enable row level security;
alter table public.history   enable row level security;
alter table public.tracks    enable row level security;

-- 2) LIKES : chaque utilisateur ne gère que ses lignes ----------------
drop policy if exists "likes_select_own" on public.likes;
drop policy if exists "likes_insert_own" on public.likes;
drop policy if exists "likes_delete_own" on public.likes;

create policy "likes_select_own" on public.likes
  for select using (auth.uid() = user_id);
create policy "likes_insert_own" on public.likes
  for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes
  for delete using (auth.uid() = user_id);

-- 3) PLAYLISTS : propriété stricte ------------------------------------
drop policy if exists "playlists_select_own" on public.playlists;
drop policy if exists "playlists_insert_own" on public.playlists;
drop policy if exists "playlists_update_own" on public.playlists;
drop policy if exists "playlists_delete_own" on public.playlists;

create policy "playlists_select_own" on public.playlists
  for select using (auth.uid() = user_id);
create policy "playlists_insert_own" on public.playlists
  for insert with check (auth.uid() = user_id);
create policy "playlists_update_own" on public.playlists
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "playlists_delete_own" on public.playlists
  for delete using (auth.uid() = user_id);

-- 4) HISTORY : propriété stricte --------------------------------------
drop policy if exists "history_select_own" on public.history;
drop policy if exists "history_insert_own" on public.history;

create policy "history_select_own" on public.history
  for select using (auth.uid() = user_id);
create policy "history_insert_own" on public.history
  for insert with check (auth.uid() = user_id);

-- 5) TRACKS : bibliothèque partagée -----------------------------------
--    Lecture pour tout le monde, écriture réservée aux comptes connectés.
drop policy if exists "tracks_select_all" on public.tracks;
drop policy if exists "tracks_insert_authenticated" on public.tracks;

create policy "tracks_select_all" on public.tracks
  for select using (true);
create policy "tracks_insert_authenticated" on public.tracks
  for insert with check (auth.uid() is not null);

-- 6) STORAGE (bucket "tracks") : lecture publique, écriture connectée --
drop policy if exists "tracks_storage_read"  on storage.objects;
drop policy if exists "tracks_storage_write" on storage.objects;

create policy "tracks_storage_read" on storage.objects
  for select using (bucket_id = 'tracks');
create policy "tracks_storage_write" on storage.objects
  for insert with check (bucket_id = 'tracks' and auth.uid() is not null);
