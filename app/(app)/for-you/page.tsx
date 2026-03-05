"use client";

import { useState, useEffect } from "react";
import { useLikesStore } from "@/store/likesStore";
import { usePlayerStore } from "@/store/playerStore";
import { TrackCard } from "@/components/music/TrackCard";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";
import { Sparkles, Play, Loader2, Music } from "lucide-react";

export default function ForYouPage() {
  const liked = useLikesStore((s) => s.liked);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get unique artists from liked tracks to build recommendations
    const artists = [...new Set(liked.map((t) => t.artist))].slice(0, 5);

    if (artists.length === 0) {
      // Fallback: use chart recommendations
      fetch(`/api/deezer?path=${encodeURIComponent("/chart/0/tracks?limit=30")}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.data) setTracks(data.data.map((t: DeezerTrack) => deezerToTrack(t)));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    // Fetch related tracks for each liked artist
    Promise.all(
      artists.map((artist) =>
        fetch(`/api/deezer?path=${encodeURIComponent(`/search?q=${encodeURIComponent(artist)}&limit=10`)}`)
          .then((r) => r.json())
          .then((data) => (data.data ? data.data.map((t: DeezerTrack) => deezerToTrack(t)) : []))
          .catch(() => [])
      )
    ).then((results) => {
      const all = results.flat();
      // Remove duplicates and already-liked tracks
      const likedIds = new Set(liked.map((t) => t.id));
      const seen = new Set<string>();
      const unique = all.filter((t) => {
        if (seen.has(t.id) || likedIds.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
      // Shuffle
      const shuffled = unique.sort(() => 0.5 - Math.random());
      setTracks(shuffled.slice(0, 30));
      setLoading(false);
    });
  }, [liked]);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 right-0 w-[500px] h-[250px] bg-purple-500/[0.08] rounded-full blur-[120px] -translate-y-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Sparkles size={22} className="text-purple-400" />
              <h1 className="text-3xl font-bold tracking-tight">For You</h1>
            </div>
            <p className="text-sm text-zinc-500">
              {liked.length > 0 ? "Based on your liked tracks" : "Popular recommendations"}
            </p>
          </div>
          {tracks.length > 0 && !loading && (
            <button type="button" onClick={() => playPlaylist(tracks, 0)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20">
              <Play size={14} fill="white" />
              Play all
            </button>
          )}
        </div>
      </div>

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
            <p className="text-sm">Like some tracks to get personalized recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
}
