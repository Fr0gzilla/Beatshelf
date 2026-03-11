import { supabase } from "./supabaseClient";
import type { Track } from "@/store/playerStore";

// ============================
// Likes
// ============================
export async function fetchLikes(): Promise<Track[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("likes")
    .select("track_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row: { track_data: Track }) => row.track_data);
}

export async function addLike(track: Track) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("likes").upsert(
    { user_id: user.id, track_id: track.id, track_data: track },
    { onConflict: "user_id,track_id" }
  );
}

export async function removeLike(trackId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("likes").delete().eq("user_id", user.id).eq("track_id", trackId);
}

// ============================
// Playlists
// ============================
export type SupabasePlaylist = {
  id: string;
  name: string;
  emoji: string;
  tracks: Track[];
};

export async function fetchPlaylists(): Promise<SupabasePlaylist[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("playlists")
    .select("id, name, emoji, tracks")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as SupabasePlaylist[];
}

export async function createPlaylistDB(name: string, emoji: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("playlists")
    .insert({ user_id: user.id, name, emoji, tracks: [] })
    .select("id")
    .single();

  if (error || !data) return null;
  return data.id;
}

export async function deletePlaylistDB(playlistId: string) {
  await supabase.from("playlists").delete().eq("id", playlistId);
}

export async function updatePlaylistTracksDB(playlistId: string, tracks: Track[]) {
  await supabase.from("playlists").update({ tracks }).eq("id", playlistId);
}

// ============================
// History
// ============================
export async function addHistoryEntry(track: Track) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("history").insert({
    user_id: user.id,
    track_id: track.id,
    track_data: track,
  });
}

export async function fetchHistory(): Promise<Track[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("history")
    .select("track_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data.map((row: { track_data: Track }) => row.track_data);
}
