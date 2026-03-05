"use client";

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { TrackCard } from "@/components/music/TrackCard";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";
import { Flame, Play, Loader2, Globe, MapPin, Music } from "lucide-react";

const tabs = [
  { label: "Top Global", icon: Globe, color: "from-purple-500 to-pink-500", query: null },
  { label: "Top France", icon: MapPin, color: "from-blue-500 to-cyan-400", query: "top hits france" },
  { label: "Rap", icon: Music, color: "from-orange-500 to-red-500", query: "rap hits" },
  { label: "Pop", icon: Music, color: "from-pink-500 to-purple-500", query: "pop hits" },
  { label: "Electro", icon: Music, color: "from-cyan-400 to-blue-500", query: "electronic dance" },
  { label: "R&B", icon: Music, color: "from-amber-500 to-orange-500", query: "rnb soul" },
  { label: "Rock", icon: Music, color: "from-red-500 to-rose-500", query: "rock hits" },
  { label: "Latino", icon: Music, color: "from-green-500 to-emerald-400", query: "reggaeton latin" },
];

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);

  useEffect(() => {
    setLoading(true);
    setTracks([]);

    const tab = tabs[activeTab];

    // Top Global uses the chart endpoint, others use search
    const path = tab.query
      ? `/search?q=${encodeURIComponent(tab.query)}&limit=25`
      : "/chart/0/tracks?limit=25";

    fetch(`/api/deezer?path=${encodeURIComponent(path)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setTracks(data.data.map((t: DeezerTrack) => deezerToTrack(t)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 right-0 w-[500px] h-[250px] bg-orange-500/[0.08] rounded-full blur-[120px] -translate-y-1/2" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Flame size={22} className="text-orange-400" />
              <h1 className="text-3xl font-bold tracking-tight">Trending</h1>
            </div>
            <p className="text-sm text-zinc-500">What the world is listening to right now</p>
          </div>

          {tracks.length > 0 && !loading && (
            <button type="button" onClick={() => playPlaylist(tracks, 0)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20">
              <Play size={14} fill="white" />
              Play all
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 md:px-10 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((t, i) => {
            const Icon = t.icon;
            const active = activeTab === i;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                    : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] border border-white/[0.06]"
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Track list */}
      <div className="px-6 md:px-10 pb-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-purple-400" />
          </div>
        ) : tracks.length > 0 ? (
          <div className="space-y-1">
            {tracks.map((track, i) => (
              <TrackCard key={`${track.id}-${i}`} track={track} index={i + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-600">
            <Music size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tracks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
