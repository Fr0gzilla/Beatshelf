"use client";

import { Play, Plus, Music2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

export function TrackCard({ track, index }: { track: any; index?: number }) {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isActive = currentTrack?.id === track.id;

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
        isActive
          ? "bg-emerald-500/10 border border-emerald-500/20"
          : "hover:bg-white/5 border border-transparent"
      }`}
      onClick={() => playPlaylist([track], 0)}
    >
      {/* Index / Play overlay */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {index ? (
          <>
            <span className={`text-sm tabular-nums group-hover:hidden ${isActive ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
              {index}
            </span>
            <Play size={14} className="hidden group-hover:block text-white" fill="white" />
          </>
        ) : (
          <Play size={14} className="text-zinc-500 group-hover:text-white" />
        )}
      </div>

      {/* Cover */}
      <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
        {track.cover ? (
          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 size={16} className="text-zinc-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? "text-emerald-400" : "text-zinc-100"}`}>
          {track.title}
        </p>
        <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          title="Add to queue"
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(track);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
