import { create } from "zustand";
import type { Track } from "@/store/playerStore";

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
    const pl: UserPlaylist = {
      id: Date.now().toString(),
      name,
      emoji,
      tracks: [],
    };
    const updated = [...get().playlists, pl];
    save(updated);
    set({ playlists: updated });
  },

  deletePlaylist: (id) => {
    const updated = get().playlists.filter((p) => p.id !== id);
    save(updated);
    set({ playlists: updated });
  },

  addToPlaylist: (playlistId, track) => {
    const updated = get().playlists.map((p) => {
      if (p.id !== playlistId) return p;
      if (p.tracks.some((t) => t.id === track.id)) return p;
      return { ...p, tracks: [...p.tracks, track] };
    });
    save(updated);
    set({ playlists: updated });
  },

  removeFromPlaylist: (playlistId, trackId) => {
    const updated = get().playlists.map((p) => {
      if (p.id !== playlistId) return p;
      return { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) };
    });
    save(updated);
    set({ playlists: updated });
  },
}));
