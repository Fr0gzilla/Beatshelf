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
  Trash2,
} from "lucide-react";
import { Maximize2 } from "lucide-react";
import { motion } from "framer-motion";


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
    clearQueue,
  } = usePlayerStore();

  const format = (sec: number) =>
    isNaN(sec)
      ? "0:00"
      : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(
          2,
          "0"
        )}`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePlay]);

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 w-full h-20 bg-zinc-950 border-t border-zinc-800 flex items-center justify-center text-zinc-400">
        No track playing...
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 px-6 py-2 flex flex-col">

      {/* --- PLAYER DESKTOP --- */}
      <div className="hidden md:flex items-center justify-between gap-6">

        {/* COVER */}
        <div className="w-14 h-14">
          <img
            src={currentTrack.cover}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-semibold">{currentTrack.title}</p>
          <p className="text-sm text-zinc-400">{currentTrack.artist}</p>
        </div>

        {/* Boutons */}
        <div className="flex items-center gap-4">

          <button
            onClick={toggleShuffle}
            className={shuffle ? "text-white" : "text-zinc-400 hover:text-white"}
          >
            <Shuffle size={20} />
          </button>

          <button onClick={prevTrack}>
            <SkipBack size={22} className="text-zinc-300 hover:text-white" />
          </button>

          <button
            onClick={togglePlay}
            className="bg-white text-black p-3 rounded-full"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button onClick={nextTrack}>
            <SkipForward size={22} className="text-zinc-300 hover:text-white" />
          </button>

          <button onClick={toggleRepeat}>
            {repeat === "all" && <Repeat size={20} className="text-white" />}
            {repeat === "one" && <Repeat1 size={20} className="text-white" />}
            {repeat === "off" && <Repeat size={20} className="text-zinc-400 hover:text-white" />}
          </button>

          <button
            onClick={clearQueue}
            className="text-zinc-400 hover:text-red-500"
          >
            <Trash2 size={20} />
          </button>

          {/* FULLSCREEN */}
          <button
            onClick={() => {
             window.location.href = "/now-playing";
            }}
            className="text-zinc-400 hover:text-white"
            >
            <Maximize2 size={20} />
          </button>


        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 w-40">
          <span className="text-xs text-zinc-500">🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-white"
          />
        </div>
      </div>

      {/* Barre de progression */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-zinc-400 w-10">{format(currentTime)}</span>

        <div
          className="flex-1 h-2 bg-zinc-700 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ratio = x / rect.width;
            seek(ratio);
          }}
        >
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <span className="text-xs text-zinc-400 w-10 text-right">{format(duration)}</span>
      </div>

      {/* MINI PLAYER */}
      <div className="md:hidden flex items-center justify-between mt-2">
        <div>
          <p className="text-sm font-medium">{currentTrack.title}</p>
          <p className="text-xs text-zinc-400">{currentTrack.artist}</p>
        </div>

        <button
          onClick={togglePlay}
          className="bg-white text-black p-2 rounded-full"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

    </div>
  );
}
