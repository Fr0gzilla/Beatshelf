"use client";

import { Play, Plus } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

export function TrackCard({ track }: { track: any }) {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  return (
    <div className="group bg-zinc-900 hover:bg-zinc-800 p-4 rounded-lg flex justify-between items-center transition cursor-pointer">

      <div className="flex gap-4 items-center">
        <img
          src={track.cover}
          className="w-14 h-14 rounded object-cover"
        />

        <div>
          <p className="font-semibold">{track.title}</p>
          <p className="text-sm text-zinc-400">{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(track);
          }}
          className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-white transition"
        >
          <Plus size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playPlaylist([track], 0);
          }}
          className="opacity-0 group-hover:opacity-100 bg-white text-black p-2 rounded-full transition"
        >
          <Play size={18} />
        </button>
      </div>
    </div>
  );
}
