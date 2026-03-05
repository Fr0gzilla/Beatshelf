"use client";

import { useState } from "react";
import { Search, Music2 } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent" />

        <div className="relative px-6 md:px-10 pt-10 pb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Search</h1>

          {/* Search input */}
          <div className="relative max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search for tracks, artists, albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-8">
        {!query ? (
          <div className="text-center py-20 text-zinc-600">
            <Music2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">Search for your favorite music</p>
            <p className="text-xs text-zinc-700 mt-1">Try artists, tracks, or albums</p>
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-600">
            <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-zinc-700 mt-1">Search is coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
