"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLikesStore } from "@/store/likesStore";
import { usePlaylistStore } from "@/store/playlistStore";
import { useHistoryStore } from "@/store/historyStore";
import { User, Heart, ListMusic, Clock, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const likedCount = useLikesStore((s) => s.liked.length);
  const playlistCount = usePlaylistStore((s) => s.playlists.length);
  const historyCount = useHistoryStore((s) => s.history.length);

  const initial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-purple-500/[0.08] rounded-full blur-[120px] -translate-y-1/2" />

        <div className="relative flex flex-col items-center text-center pt-8 pb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/20 mb-4">
            {initial}
          </div>
          <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
          <p className="text-sm text-zinc-500 mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 md:px-10 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Liked", value: likedCount, icon: Heart, color: "text-pink-400" },
            { label: "Playlists", value: playlistCount + 2, icon: ListMusic, color: "text-purple-400" },
            { label: "Listened", value: historyCount, icon: Clock, color: "text-orange-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
              <stat.icon size={18} className={`${stat.color} mx-auto mb-2`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 md:px-10 pb-8">
        <h2 className="text-sm font-semibold text-zinc-400 mb-3">Account</h2>
        <div className="space-y-2">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-left group"
          >
            <LogOut size={16} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium group-hover:text-red-400 transition-colors">Log out</span>
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="px-6 md:px-10 pb-12">
        <h2 className="text-sm font-semibold text-zinc-400 mb-3">Keyboard shortcuts</h2>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-2.5">
          {[
            { key: "Space", action: "Play / Pause" },
            { key: "\u2192", action: "Forward 5s" },
            { key: "\u2190", action: "Rewind 5s" },
            { key: "Shift + \u2192", action: "Next track" },
            { key: "Shift + \u2190", action: "Previous track" },
            { key: "\u2191 / \u2193", action: "Volume up / down" },
            { key: "M", action: "Mute / Unmute" },
          ].map((s) => (
            <div key={s.key} className="flex items-center justify-between">
              <span className="text-[12px] text-zinc-500">{s.action}</span>
              <kbd className="text-[11px] bg-white/[0.06] border border-white/[0.08] rounded-md px-2 py-0.5 text-zinc-400 font-mono">{s.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
