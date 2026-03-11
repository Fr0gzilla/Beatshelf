"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, AudioLines, Loader2 } from "lucide-react";
import { TrackCard } from "@/components/music/TrackCard";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/deezer?path=/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.data) {
          setResults(data.data.map((t: DeezerTrack) => deezerToTrack(t)));
        }
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 left-0 w-[400px] h-[200px] bg-pink-500/[0.08] rounded-full blur-[100px] -translate-y-1/2" />

        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Search</h1>

          <div className="relative max-w-lg">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Tracks, artists, albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tracks, artists, albums"
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-4">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-purple-400" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-1">
            {results.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i + 1} />
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-16 text-zinc-600">
            <AudioLines size={40} className="mx-auto mb-4 opacity-20" />
            {!query ? (
              <>
                <p className="text-sm">Find your next favorite beat</p>
                <p className="text-[11px] text-zinc-700 mt-1">Search by artist, track, or genre</p>
              </>
            ) : (
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
