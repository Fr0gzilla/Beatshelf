import { create } from "zustand";
import type { Track } from "@/store/playerStore";
import { addHistoryEntry, fetchHistory } from "@/lib/supabaseData";

type HistoryState = {
  history: Track[];
  addToHistory: (track: Track) => void;
  syncFromSupabase: () => Promise<void>;
};

function load(): Track[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("beatshelf_history") || "[]");
  } catch {
    return [];
  }
}

function save(history: Track[]) {
  localStorage.setItem("beatshelf_history", JSON.stringify(history));
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: load(),

  addToHistory: (track) => {
    const current = get().history.filter((t) => t.id !== track.id);
    const updated = [track, ...current].slice(0, 50);
    save(updated);
    set({ history: updated });

    // Sync to Supabase in background
    addHistoryEntry(track).catch(() => {});
  },

  syncFromSupabase: async () => {
    try {
      const history = await fetchHistory();
      if (history.length > 0) {
        save(history);
        set({ history });
      }
    } catch {
      // Keep localStorage data as fallback
    }
  },
}));
