"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TrackCard } from "@/components/music/TrackCard";
import { Library, Clock } from "lucide-react";

export default function LibraryPage() {
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: history } = await supabase
      .from("history")
      .select("track_id, played_at")
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })
      .limit(30);

    if (!history) return;

    const trackIds = history.map((x) => x.track_id);

    const { data: tracksData } = await supabase
      .from("tracks")
      .select("*")
      .in("id", trackIds);

    setTracks(tracksData || []);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-pink-500/5 to-transparent" />

        <div className="relative px-6 md:px-10 pt-10 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Library</h1>
          <p className="text-sm text-zinc-500 mt-1">Recently played tracks</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-4">
        {tracks.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <Clock size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No listening history yet</p>
            <p className="text-xs text-zinc-700 mt-1">Play some tracks to see them here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
