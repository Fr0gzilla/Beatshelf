import { create } from "zustand";
import type { Track } from "@/store/playerStore";

type HistoryState = {
  history: Track[];
  addToHistory: (track: Track) => void;
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
  },
}));
