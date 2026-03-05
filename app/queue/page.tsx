"use client";

import { usePlayerStore } from "@/store/playerStore";
import { TrackCard } from "@/components/music/TrackCard";
import { ListMusic, Trash2 } from "lucide-react";

export default function QueuePage() {
  const queue = usePlayerStore((s) => s.queue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent" />

        <div className="relative px-6 md:px-10 pt-10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Queue</h1>
              <p className="text-sm text-zinc-500 mt-1">{queue.length} track{queue.length !== 1 ? "s" : ""}</p>
            </div>

            {queue.length > 0 && (
              <button
                type="button"
                onClick={clearQueue}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-4">
        {queue.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <ListMusic size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">Your queue is empty</p>
            <p className="text-xs text-zinc-700 mt-1">Add tracks from the home page</p>
          </div>
        ) : (
          <div className="space-y-1">
            {queue.map((track, i) => (
              <TrackCard key={`${track.id}-${i}`} track={track} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
