"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Maximize2,
  Music2,
} from "lucide-react";
import Link from "next/link";

export function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    progress,
    currentTime,
    duration,
    seek,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const format = (sec: number) =>
    isNaN(sec)
      ? "0:00"
      : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePlay]);

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-[#0f0f11]/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center gap-3 text-zinc-600">
        <Music2 size={18} />
        <span className="text-sm">Select a track to start listening</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f11]/90 backdrop-blur-2xl border-t border-white/5">
      {/* Progress bar (top edge) */}
      <div
        className="h-1 bg-zinc-800 cursor-pointer group relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seek((e.clientX - rect.left) / rect.width);
        }}
      >
        <div
          className="h-full bg-emerald-500 transition-all duration-150 relative"
          style={{ width: `${progress * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Desktop player */}
      <div className="hidden md:flex items-center gap-4 px-4 h-[72px]">
        {/* Track info */}
        <div className="flex items-center gap-3 w-[280px] min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0 shadow-lg">
            {currentTrack.cover ? (
              <img src={currentTrack.cover} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music2 size={20} className="text-zinc-600" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
            <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Center controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button
              onClick={toggleShuffle}
              className={`transition-colors ${shuffle ? "text-emerald-400" : "text-zinc-500 hover:text-white"}`}
            >
              <Shuffle size={16} />
            </button>

            <button onClick={prevTrack} className="text-zinc-300 hover:text-white transition-colors">
              <SkipBack size={20} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={16} className="text-black" fill="black" />
              ) : (
                <Play size={16} className="text-black ml-0.5" fill="black" />
              )}
            </button>

            <button onClick={nextTrack} className="text-zinc-300 hover:text-white transition-colors">
              <SkipForward size={20} fill="currentColor" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`transition-colors ${repeat !== "off" ? "text-emerald-400" : "text-zinc-500 hover:text-white"}`}
            >
              {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-[10px] text-zinc-500 w-8 text-right tabular-nums">{format(currentTime)}</span>
            <div
              className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer group relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seek((e.clientX - rect.left) / rect.width);
              }}
            >
              <div
                className="h-full bg-zinc-300 group-hover:bg-emerald-400 rounded-full transition-colors relative"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 w-8 tabular-nums">{format(duration)}</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 w-[200px] justify-end">
          <Link href="/now-playing" className="text-zinc-500 hover:text-white transition-colors">
            <Maximize2 size={16} />
          </Link>

          <div className="flex items-center gap-2 w-28">
            <Volume2 size={16} className="text-zinc-500 shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-green"
              style={{ "--val": `${volume * 100}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      {/* Mobile player */}
      <div className="md:hidden flex items-center gap-3 px-4 h-16">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
          {currentTrack.cover ? (
            <img src={currentTrack.cover} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 size={16} className="text-zinc-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentTrack.title}</p>
          <p className="text-[11px] text-zinc-500 truncate">{currentTrack.artist}</p>
        </div>

        <button onClick={prevTrack} className="text-zinc-400">
          <SkipBack size={18} fill="currentColor" />
        </button>

        <button
          onClick={togglePlay}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause size={14} className="text-black" fill="black" />
          ) : (
            <Play size={14} className="text-black ml-0.5" fill="black" />
          )}
        </button>

        <button onClick={nextTrack} className="text-zinc-400">
          <SkipForward size={18} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
