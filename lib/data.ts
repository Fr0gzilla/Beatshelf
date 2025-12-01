import { supabase } from "./supabaseClient";

export async function getSongs() {
  const { data, error } = await supabase.from("songs").select("*");

  if (error) {
    console.error("Error loading songs:", error);
    return [];
  }

  return data;
}

