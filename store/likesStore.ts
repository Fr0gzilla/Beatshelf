import { create } from "zustand";
import type { Track } from "@/store/playerStore";
import { fetchLikes, addLike, removeLike } from "@/lib/supabaseData";

type LikesState = {
  liked: Track[];
  isLiked: (id: string) => boolean;
  toggleLike: (track: Track) => void;
  syncFromSupabase: () => Promise<void>;
};

function loadLiked(): Track[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("beatshelf_liked") || "[]");
  } catch {
    return [];
  }
}

function saveLiked(liked: Track[]) {
  localStorage.setItem("beatshelf_liked", JSON.stringify(liked));
}

export const useLikesStore = create<LikesState>((set, get) => ({
  liked: loadLiked(),

  isLiked: (id) => get().liked.some((t) => t.id === id),

  toggleLike: (track) => {
    const current = get().liked;
    const exists = current.some((t) => t.id === track.id);
    const updated = exists
      ? current.filter((t) => t.id !== track.id)
      : [track, ...current];
    saveLiked(updated);
    set({ liked: updated });

    // Sync to Supabase in background
    if (exists) {
      removeLike(track.id).catch(() => {});
    } else {
      addLike(track).catch(() => {});
    }
  },

  syncFromSupabase: async () => {
    try {
      const likes = await fetchLikes();
      if (likes.length > 0) {
        saveLiked(likes);
        set({ liked: likes });
      }
    } catch {
      // Keep localStorage data as fallback
    }
  },
}));
