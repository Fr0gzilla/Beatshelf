"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Player } from "@/components/player/Player";
import { ToastContainer } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePlayerStore } from "@/store/playerStore";
import { useHistoryStore } from "@/store/historyStore";
import { useLikesStore } from "@/store/likesStore";
import { usePlaylistStore } from "@/store/playlistStore";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

function HistoryTracker() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const addToHistory = useHistoryStore((s) => s.addToHistory);

  useEffect(() => {
    if (currentTrack) {
      addToHistory(currentTrack);
    }
  }, [currentTrack, addToHistory]);

  return null;
}

function SupabaseSync() {
  const syncLikes = useLikesStore((s) => s.syncFromSupabase);
  const syncPlaylists = usePlaylistStore((s) => s.syncFromSupabase);
  const syncHistory = useHistoryStore((s) => s.syncFromSupabase);

  useEffect(() => {
    // Defer sync to not block initial render
    const t = setTimeout(() => {
      syncLikes();
      syncPlaylists();
      syncHistory();
    }, 500);
    return () => clearTimeout(t);
  }, [syncLikes, syncPlaylists, syncHistory]);

  return null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  useKeyboardShortcuts();

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-orange-500/[0.05] rounded-full blur-[120px]" />
      </div>

      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 md:pb-28 relative z-10">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Player />
      <ToastContainer />
      <HistoryTracker />
      <SupabaseSync />
    </div>
  );
}
