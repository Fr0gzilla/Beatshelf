"use client";

import { usePlayerStore } from "@/store/playerStore";

export default function QueuePage() {
  const queue = usePlayerStore((s) => s.queue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Queue</h1>

      <button
        onClick={clearQueue}
        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white mb-6"
      >
        Clear Queue
      </button>

      {queue.length === 0 && (
        <p className="text-zinc-400">Your queue is empty.</p>
      )}

      <div className="space-y-4">
        {queue.map((track, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-zinc-900 p-4 rounded-lg"
          >
            <img
              src={track.cover}
              className="w-14 h-14 rounded object-cover"
            />

            <div>
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-zinc-400">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
