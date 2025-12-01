"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TrackCard } from "@/components/music/TrackCard";

export default function LibraryPage() {
  const [tracks, setTracks] = useState([]);

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
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Écoutés récemment</h1>

      <div className="space-y-3">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
