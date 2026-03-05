"use client";

import { usePlayerStore } from "@/store/playerStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  ChevronDown,
  Volume2,
  Music2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NowPlaying() {
  const router = useRouter();

  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    progress,
    currentTime,
    duration,
    seek,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    volume,
    setVolume,
  } = usePlayerStore();

  if (!currentTrack) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-zinc-600 gap-3">
        <Music2 size={48} className="opacity-30" />
        <p className="text-sm">No track playing</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs text-emerald-400 hover:underline mt-2"
        >
          Go back
        </button>
      </div>
    );
  }

  const format = (sec: number) =>
    isNaN(sec)
      ? "0:00"
      : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Background blur */}
      {currentTrack.cover && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 blur-3xl scale-110"
          style={{ backgroundImage: `url(${currentTrack.cover})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-[#09090b]/60 to-[#09090b]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Close */}
        <button
          type="button"
          title="Close"
          onClick={() => router.back()}
          className="self-start text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ChevronDown size={28} />
        </button>

        {/* Cover */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-zinc-800"
        >
          {currentTrack.cover ? (
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 size={64} className="text-zinc-700" />
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 w-full"
        >
          <h1 className="text-2xl md:text-3xl font-bold truncate">{currentTrack.title}</h1>
          <p className="text-zinc-400 mt-1 text-sm">{currentTrack.artist}</p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-8"
        >
          <div
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
          >
            <div
              className="h-full bg-white rounded-full relative transition-all"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[11px] text-zinc-500 tabular-nums">{format(currentTime)}</span>
            <span className="text-[11px] text-zinc-500 tabular-nums">{format(duration)}</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-8 mt-6"
        >
          <button
            type="button"
            title="Shuffle"
            onClick={toggleShuffle}
            className={`transition-colors ${shuffle ? "text-emerald-400" : "text-zinc-500 hover:text-white"}`}
          >
            <Shuffle size={20} />
          </button>

          <button type="button" title="Previous" onClick={prevTrack} className="text-zinc-300 hover:text-white transition-colors">
            <SkipBack size={28} fill="currentColor" />
          </button>

          <button
            type="button"
            title={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={24} className="text-black" fill="black" />
            ) : (
              <Play size={24} className="text-black ml-1" fill="black" />
            )}
          </button>

          <button type="button" title="Next" onClick={nextTrack} className="text-zinc-300 hover:text-white transition-colors">
            <SkipForward size={28} fill="currentColor" />
          </button>

          <button
            type="button"
            title="Repeat"
            onClick={toggleRepeat}
            className={`transition-colors ${repeat !== "off" ? "text-emerald-400" : "text-zinc-500 hover:text-white"}`}
          >
            {repeat === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </motion.div>

        {/* Volume */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 mt-8 w-48"
        >
          <Volume2 size={16} className="text-zinc-500 shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-label="Volume"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-green"
            style={{ "--val": `${volume * 100}%` } as React.CSSProperties}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
