"use client";

import { useState, useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  ChevronDown, Volume2, AudioLines, Mic2, BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Simple audio visualizer bars
function Visualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = 32;
  const heights = useRef(Array.from({ length: bars }, () => 20));
  const [, setTick] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) return;
    let active = true;
    const animate = () => {
      if (!active) return;
      heights.current = heights.current.map(() => 15 + Math.random() * 85);
      setTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(animate);
    };
    // Throttle to ~15fps
    const interval = setInterval(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 66);
    return () => {
      active = false;
      clearInterval(interval);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex items-end justify-center gap-[2px] h-16 w-full">
      {heights.current.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-100"
          style={{
            height: `${isPlaying ? h : 20}%`,
            background: `linear-gradient(to top, #a855f7, #f97316)`,
            opacity: isPlaying ? 0.7 : 0.2,
          }}
        />
      ))}
    </div>
  );
}

export default function NowPlaying() {
  const router = useRouter();
  const {
    currentTrack, isPlaying, togglePlay, nextTrack, prevTrack,
    progress, currentTime, duration, seek, shuffle, toggleShuffle,
    repeat, toggleRepeat, volume, setVolume,
  } = usePlayerStore();

  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  useEffect(() => {
    if (!currentTrack || !showLyrics) return;
    setLoadingLyrics(true);
    setLyrics(null);

    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(currentTrack.artist)}/${encodeURIComponent(currentTrack.title)}`)
      .then((r) => r.json())
      .then((data) => {
        setLyrics(data.lyrics || null);
      })
      .catch(() => setLyrics(null))
      .finally(() => setLoadingLyrics(false));
  }, [currentTrack, showLyrics]);

  if (!currentTrack) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-zinc-600 gap-3">
        <AudioLines size={48} className="opacity-20" />
        <p className="text-sm">Nothing playing</p>
        <button type="button" onClick={() => router.back()} className="text-xs text-purple-400 hover:underline mt-2">Go back</button>
      </div>
    );
  }

  const format = (sec: number) =>
    isNaN(sec) ? "0:00" : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="min-h-screen w-full flex flex-col items-center px-6 relative overflow-hidden">

      {/* Background */}
      {currentTrack.cover && (
        <div className="fixed inset-0 bg-cover bg-center opacity-20 blur-[80px] scale-125"
          style={{ backgroundImage: `url(${currentTrack.cover})` }} />
      )}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/70 to-[#0a0a0f]" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full pt-8 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between w-full mb-8">
          <button type="button" title="Close" onClick={() => router.back()}
            className="text-zinc-500 hover:text-white transition-colors">
            <ChevronDown size={26} />
          </button>
          <div className="flex items-center gap-2">
            <button type="button" title="Lyrics" onClick={() => setShowLyrics(!showLyrics)}
              className={`p-2 rounded-lg transition-colors ${showLyrics ? "text-purple-400 bg-purple-500/10" : "text-zinc-600 hover:text-white"}`}>
              <Mic2 size={18} />
            </button>
          </div>
        </div>

        {showLyrics ? (
          /* Lyrics view */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full flex-1 mb-8">
            <div className="w-full max-h-[50vh] overflow-y-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
              {loadingLyrics ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : lyrics ? (
                <p className="text-sm text-zinc-400 leading-7 whitespace-pre-line">{lyrics}</p>
              ) : (
                <div className="text-center py-12 text-zinc-600">
                  <Mic2 size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Lyrics not available</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Cover + Visualizer */
          <>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="relative">
              <div className="w-60 h-60 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/30 ring-1 ring-white/10 bg-zinc-900">
                {currentTrack.cover ? (
                  <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <AudioLines size={56} className="text-zinc-800" />
                  </div>
                )}
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-zinc-900 border-4 border-zinc-800 opacity-40 hidden md:block">
                <div className="w-full h-full rounded-full border-2 border-zinc-700 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                </div>
              </div>
            </motion.div>

            {/* Visualizer */}
            <div className="w-full mt-6">
              <Visualizer isPlaying={isPlaying} />
            </div>
          </>
        )}

        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="text-center mt-6 w-full">
          <h1 className="text-2xl md:text-3xl font-bold truncate">{currentTrack.title}</h1>
          <p className="text-zinc-500 mt-1.5 text-sm">{currentTrack.artist}</p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="w-full mt-8">
          <div className="w-full h-1.5 bg-white/[0.08] rounded-full cursor-pointer group"
            onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
            <div className="h-full bg-gradient-to-r from-purple-500 to-orange-400 rounded-full relative transition-all"
              style={{ width: `${progress * 100}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-zinc-600 tabular-nums">{format(currentTime)}</span>
            <span className="text-[10px] text-zinc-600 tabular-nums">{format(duration)}</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-9 mt-6">
          <button type="button" title="Shuffle" onClick={toggleShuffle}
            className={`transition-colors ${shuffle ? "text-purple-400" : "text-zinc-600 hover:text-white"}`}>
            <Shuffle size={19} />
          </button>
          <button type="button" title="Previous" onClick={prevTrack} className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack size={26} fill="currentColor" />
          </button>
          <button type="button" title={isPlaying ? "Pause" : "Play"} onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-purple-500/30">
            {isPlaying ? <Pause size={26} className="text-white" fill="white" /> : <Play size={26} className="text-white ml-1" fill="white" />}
          </button>
          <button type="button" title="Next" onClick={nextTrack} className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward size={26} fill="currentColor" />
          </button>
          <button type="button" title="Repeat" onClick={toggleRepeat}
            className={`transition-colors ${repeat !== "off" ? "text-purple-400" : "text-zinc-600 hover:text-white"}`}>
            {repeat === "one" ? <Repeat1 size={19} /> : <Repeat size={19} />}
          </button>
        </motion.div>

        {/* Volume */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="flex items-center gap-3 mt-8 w-44">
          <Volume2 size={14} className="text-zinc-600 shrink-0" />
          <input type="range" min={0} max={1} step={0.01} value={volume} aria-label="Volume"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full range-brand"
            style={{ "--val": `${volume * 100}%` } as React.CSSProperties} />
        </motion.div>
      </div>
    </motion.div>
  );
}
