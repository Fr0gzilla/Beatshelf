"use client";

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { TrackCard } from "@/components/music/TrackCard";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";
import { Play, AudioLines, Headphones, Mic2, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/Toast";

export default function Home() {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deezer?path=/chart/0/tracks?limit=20")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setTracks(data.data.map((t: DeezerTrack) => deezerToTrack(t)));
        }
      })
      .catch(() => { toast("Failed to load trending tracks", "error"); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 md:pt-14 pb-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-purple-600/15 via-orange-500/10 to-transparent rounded-full blur-[100px] -translate-y-1/2" />

        <div className="relative">
          {/* EQ bars */}
          <div className="flex items-end gap-[5px] h-8 mb-5 opacity-60">
            {[0, 0.1, 0.2, 0.3, 0.15, 0.25, 0.35, 0.05].map((d, i) => (
              <div key={i} className="w-[4px] rounded-full eq-bar"
                style={{ animationDelay: `${d}s`, background: "linear-gradient(to top, #a855f7, #f97316)" }} />
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Feel the{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">rhythm</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base mt-3 max-w-lg leading-relaxed">
            Your personal beat sanctuary. Discover and lose yourself in the music.
          </p>

          {tracks.length > 0 && (
            <button type="button" onClick={() => playPlaylist(tracks, 0)}
              className="mt-6 flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20">
              <Play size={16} fill="white" />
              Play all
            </button>
          )}
        </div>
      </div>

      {/* Quick nav */}
      <div className="px-6 md:px-10 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Trending", sub: "Hot beats", icon: Flame, color: "from-orange-500/15 to-orange-500/5", iconColor: "text-orange-400", href: "/trending" },
            { label: "Library", sub: "Your history", icon: Headphones, color: "from-purple-500/15 to-purple-500/5", iconColor: "text-purple-400", href: "/library" },
            { label: "Artists", sub: "Discover", icon: Mic2, color: "from-pink-500/15 to-pink-500/5", iconColor: "text-pink-400", href: "/artists" },
            { label: "Upload", sub: "Share beats", icon: AudioLines, color: "from-cyan-500/15 to-cyan-500/5", iconColor: "text-cyan-400", href: "/upload" },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className={`group bg-gradient-to-br ${item.color} border border-white/[0.05] rounded-2xl p-4 hover:border-white/[0.1] transition-all`}>
              <item.icon size={20} className={`${item.iconColor} mb-2.5 group-hover:scale-110 transition-transform`} />
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-[11px] text-zinc-600 mt-0.5">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Track list */}
      <div className="px-6 md:px-10 pb-12">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex items-end gap-[2px] h-4">
            {[0, 0.12, 0.24].map((d, i) => (
              <div key={i} className="w-[3px] rounded-full eq-bar bg-purple-400" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
          <h2 className="text-lg font-bold">Trending Now</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-purple-400" />
          </div>
        ) : tracks.length > 0 ? (
          <div className="space-y-1">
            {tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-600">
            <AudioLines size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Could not load trending tracks</p>
          </div>
        )}
      </div>
    </div>
  );
}
