"use client";

import { usePlayerStore } from "@/store/playerStore";
import { TrackCard } from "@/components/music/TrackCard";
import { ListMusic, Trash2 } from "lucide-react";

export default function QueuePage() {
  const queue = usePlayerStore((s) => s.queue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-blue-500/[0.07] rounded-full blur-[100px] -translate-y-1/2" />

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Queue</h1>
            <p className="text-sm text-zinc-600 mt-1">{queue.length} track{queue.length !== 1 ? "s" : ""} up next</p>
          </div>
          {queue.length > 0 && (
            <button type="button" onClick={clearQueue}
              className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-red-400 bg-white/[0.04] hover:bg-red-500/10 px-4 py-2 rounded-xl border border-white/[0.06] transition-all">
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="px-6 md:px-10 py-4">
        {queue.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <ListMusic size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">Queue is empty</p>
            <p className="text-[11px] text-zinc-700 mt-1">Tap + on tracks to add them here</p>
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
