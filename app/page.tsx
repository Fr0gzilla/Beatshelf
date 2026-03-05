"use client";

import { demoTracks } from "@/lib/tracks";
import { usePlayerStore } from "@/store/playerStore";
import { TrackCard } from "@/components/music/TrackCard";
import { Play, Disc3, Headphones, Radio } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative px-6 md:px-10 pt-10 pb-8">
          <p className="text-sm text-emerald-400 font-medium mb-2">Welcome back</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Good vibes only
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-md">
            Your personal music space. Discover, upload, and enjoy your favorite beats.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-6 md:px-10 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => playPlaylist(demoTracks, 0)}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play size={18} className="text-black ml-0.5" fill="black" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Play Demo</p>
              <p className="text-[11px] text-zinc-500">Start listening</p>
            </div>
          </button>

          <Link href="/library" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
              <Headphones size={18} className="text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Library</p>
              <p className="text-[11px] text-zinc-500">Your history</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3 bg-white/5 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
              <Radio size={18} className="text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Discover</p>
              <p className="text-[11px] text-zinc-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks section */}
      <div className="px-6 md:px-10 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <Disc3 size={20} className="text-emerald-400" />
          <h2 className="text-xl font-bold">Tracks</h2>
        </div>

        {demoTracks.length > 0 ? (
          <div className="space-y-1">
            {demoTracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-600">
            <Disc3 size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No tracks yet. Upload some music to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
