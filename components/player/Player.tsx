"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { QueuePanel } from "@/components/player/QueuePanel";
import {
  Play, Pause, SkipForward, SkipBack, Shuffle,
  Repeat, Repeat1, Volume2, Maximize2, AudioLines, ListMusic,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Player() {
  const {
    currentTrack, isPlaying, togglePlay, progress, currentTime, duration,
    seek, nextTrack, prevTrack, volume, setVolume, shuffle, repeat,
    toggleShuffle, toggleRepeat, queue,
  } = usePlayerStore();

  const [queueOpen, setQueueOpen] = useState(false);

  const format = (sec: number) =>
    isNaN(sec) ? "0:00" : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/[0.04] backdrop-blur-2xl border border-white/[0.06] rounded-2xl px-6 py-4 flex items-center gap-3 text-zinc-600 shadow-xl shadow-black/20">
          <AudioLines size={16} className="opacity-40" />
          <span className="text-sm">Pick a track to vibe</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 md:pb-4 px-3 md:px-6 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-4xl bg-[#13131a]/80 backdrop-blur-2xl border border-white/[0.07] rounded-2xl shadow-2xl shadow-purple-900/10 overflow-hidden">
          {/* Progress top */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div className="h-[3px] bg-white/[0.06] cursor-pointer group" role="progressbar" aria-label="Track progress"
            aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}
            onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
            <div className="h-full bg-gradient-to-r from-purple-500 to-orange-400 relative transition-all duration-100"
              style={{ width: `${progress * 100}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-5 px-5 h-[68px]">
            <div className="flex items-center gap-3.5 w-[240px] min-w-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/[0.06] shrink-0 ring-1 ring-white/[0.08]">
                {currentTrack.cover ? (
                  <Image src={currentTrack.cover} alt={currentTrack.title} width={44} height={44} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><AudioLines size={16} className="text-zinc-600" /></div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold truncate">{currentTrack.title}</p>
                <p className="text-[11px] text-zinc-500 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-5">
                <button type="button" title="Shuffle" onClick={toggleShuffle}
                  className={`transition-colors ${shuffle ? "text-purple-400" : "text-zinc-600 hover:text-zinc-300"}`}>
                  <Shuffle size={15} />
                </button>
                <button type="button" title="Previous" onClick={prevTrack} className="text-zinc-400 hover:text-white transition-colors">
                  <SkipBack size={18} fill="currentColor" />
                </button>
                <button type="button" title={isPlaying ? "Pause" : "Play"} onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-purple-500/25">
                  {isPlaying ? <Pause size={16} className="text-white" fill="white" /> : <Play size={16} className="text-white ml-0.5" fill="white" />}
                </button>
                <button type="button" title="Next" onClick={nextTrack} className="text-zinc-400 hover:text-white transition-colors">
                  <SkipForward size={18} fill="currentColor" />
                </button>
                <button type="button" title="Repeat" onClick={toggleRepeat}
                  className={`transition-colors ${repeat !== "off" ? "text-purple-400" : "text-zinc-600 hover:text-zinc-300"}`}>
                  {repeat === "one" ? <Repeat1 size={15} /> : <Repeat size={15} />}
                </button>
              </div>
              <div className="flex items-center gap-2.5 w-full max-w-sm">
                <span className="text-[10px] text-zinc-600 w-8 text-right tabular-nums">{format(currentTime)}</span>
                <div className="flex-1 h-1 bg-white/[0.06] rounded-full cursor-pointer group"
                  onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
                  <div className="h-full bg-purple-400/60 group-hover:bg-purple-400 rounded-full transition-colors"
                    style={{ width: `${progress * 100}%` }} />
                </div>
                <span className="text-[10px] text-zinc-600 w-8 tabular-nums">{format(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-[200px] justify-end">
              <button type="button" title="Queue" onClick={() => setQueueOpen(true)}
                className={`relative transition-colors ${queue.length > 0 ? "text-purple-400" : "text-zinc-600 hover:text-purple-400"}`}>
                <ListMusic size={15} />
                {queue.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-500 rounded-full text-[8px] font-bold flex items-center justify-center text-white">
                    {queue.length}
                  </span>
                )}
              </button>
              <Link href="/now-playing" className="text-zinc-600 hover:text-purple-400 transition-colors">
                <Maximize2 size={15} />
              </Link>
              <div className="flex items-center gap-2 w-24">
                <Volume2 size={14} className="text-zinc-600 shrink-0" />
                <input type="range" min={0} max={1} step={0.01} value={volume} aria-label="Volume"
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full range-brand"
                  style={{ "--val": `${volume * 100}%` } as React.CSSProperties} />
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3 px-4 h-[64px]">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/[0.06] shrink-0 ring-1 ring-white/[0.08]">
              {currentTrack.cover ? (
                <Image src={currentTrack.cover} alt={currentTrack.title} width={40} height={40} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><AudioLines size={14} className="text-zinc-600" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate">{currentTrack.title}</p>
              <p className="text-[10px] text-zinc-500 truncate">{currentTrack.artist}</p>
            </div>
            <button type="button" title="Previous" onClick={prevTrack} className="text-zinc-500"><SkipBack size={16} fill="currentColor" /></button>
            <button type="button" title={isPlaying ? "Pause" : "Play"} onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center">
              {isPlaying ? <Pause size={14} className="text-white" fill="white" /> : <Play size={14} className="text-white ml-0.5" fill="white" />}
            </button>
            <button type="button" title="Next" onClick={nextTrack} className="text-zinc-500"><SkipForward size={16} fill="currentColor" /></button>
          </div>
        </div>
      </div>

      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
    </>
  );
}
