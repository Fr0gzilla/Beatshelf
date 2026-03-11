import { create } from "zustand";
import type { Track } from "@/store/playerStore";
import {
  fetchPlaylists,
  createPlaylistDB,
  deletePlaylistDB,
  updatePlaylistTracksDB,
} from "@/lib/supabaseData";

export type UserPlaylist = {
  id: string;
  name: string;
  emoji: string;
  tracks: Track[];
};

const GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
  "from-red-500 to-rose-600",
  "from-cyan-500 to-teal-600",
  "from-fuchsia-500 to-pink-600",
];

const SHADOWS = [
  "shadow-emerald-500/20",
  "shadow-rose-500/20",
  "shadow-sky-500/20",
  "shadow-amber-500/20",
  "shadow-violet-500/20",
  "shadow-red-500/20",
  "shadow-cyan-500/20",
  "shadow-fuchsia-500/20",
];

export function getPlaylistStyle(index: number) {
  return {
    gradient: GRADIENTS[index % GRADIENTS.length],
    shadow: SHADOWS[index % SHADOWS.length],
  };
}

type PlaylistState = {
  playlists: UserPlaylist[];
  createPlaylist: (name: string, emoji: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  syncFromSupabase: () => Promise<void>;
};

function load(): UserPlaylist[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("beatshelf_playlists") || "[]");
  } catch {
    return [];
  }
}

function save(playlists: UserPlaylist[]) {
  localStorage.setItem("beatshelf_playlists", JSON.stringify(playlists));
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: load(),

  createPlaylist: (name, emoji) => {
    const tempId = Date.now().toString();
    const pl: UserPlaylist = { id: tempId, name, emoji, tracks: [] };
    const updated = [...get().playlists, pl];
    save(updated);
    set({ playlists: updated });

    // Sync to Supabase and update with real ID
    createPlaylistDB(name, emoji).then((realId) => {
      if (realId) {
        const current = get().playlists.map((p) =>
          p.id === tempId ? { ...p, id: realId } : p
        );
        save(current);
        set({ playlists: current });
      }
    }).catch(() => {});
  },

  deletePlaylist: (id) => {
    const updated = get().playlists.filter((p) => p.id !== id);
    save(updated);
    set({ playlists: updated });
    deletePlaylistDB(id).catch(() => {});
  },

  addToPlaylist: (playlistId, track) => {
    const updated = get().playlists.map((p) => {
      if (p.id !== playlistId) return p;
      if (p.tracks.some((t) => t.id === track.id)) return p;
      return { ...p, tracks: [...p.tracks, track] };
    });
    save(updated);
    set({ playlists: updated });

    const pl = updated.find((p) => p.id === playlistId);
    if (pl) updatePlaylistTracksDB(playlistId, pl.tracks).catch(() => {});
  },

  removeFromPlaylist: (playlistId, trackId) => {
    const updated = get().playlists.map((p) => {
      if (p.id !== playlistId) return p;
      return { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) };
    });
    save(updated);
    set({ playlists: updated });

    const pl = updated.find((p) => p.id === playlistId);
    if (pl) updatePlaylistTracksDB(playlistId, pl.tracks).catch(() => {});
  },

  syncFromSupabase: async () => {
    try {
      const playlists = await fetchPlaylists();
      if (playlists.length > 0) {
        save(playlists);
        set({ playlists });
      }
    } catch {
      // Keep localStorage data as fallback
    }
  },
}));
