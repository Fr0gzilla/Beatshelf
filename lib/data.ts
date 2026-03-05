import { supabase } from "./supabaseClient";

export async function getSongs() {
  const { data, error } = await supabase.from("songs").select("*");

  if (error) {
    console.error("Error loading songs:", error);
    return [];
  }

  return data;
}

// Demo data for album/artist/playlist pages
export const albums: {
  id: string;
  title: string;
  artist: string;
  cover: string;
  tracks: { id: string; title: string; artist: string; url: string; cover: string }[];
}[] = [];

export const artists: {
  id: string;
  name: string;
  picture: string;
  followers: number;
  albums: { id: string; title: string; artist: string; cover: string }[];
}[] = [];

export const playlists: {
  id: string;
  name: string;
  cover: string;
  tracks: { id: string; title: string; artist: string; url: string; cover: string }[];
}[] = [];

