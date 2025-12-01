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
  ArrowDown,
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
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-zinc-500">
        No track playing...
      </div>
    );
  }

  const format = (sec: number) =>
    isNaN(sec)
      ? "0:00"
      : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(
          2,
          "0"
        )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full bg-zinc-900 text-white flex flex-col p-6"
    >
      {/* Close button */}
      <button
        onClick={() => router.back()}
        className="text-zinc-400 hover:text-white mb-4"
      >
        <ArrowDown size={28} />
      </button>

      {/* Cover animation */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center mt-4"
      >
        <img
          src={currentTrack.cover}
          className="w-72 h-72 md:w-96 md:h-96 rounded-lg shadow-lg object-cover"
        />
      </motion.div>

      {/* Infos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-6"
      >
        <h1 className="text-3xl font-bold">{currentTrack.title}</h1>
        <p className="text-zinc-400 mt-1">{currentTrack.artist}</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-6 mt-8"
      >
        <button
          onClick={toggleShuffle}
          className={shuffle ? "text-white" : "text-zinc-400"}
        >
          <Shuffle size={26} />
        </button>

        <button onClick={prevTrack}>
          <SkipBack size={34} className="text-zinc-300 hover:text-white" />
        </button>

        <button
          onClick={togglePlay}
          className="bg-white text-black p-4 rounded-full"
        >
          {isPlaying ? <Pause size={30} /> : <Play size={30} />}
        </button>

        <button onClick={nextTrack}>
          <SkipForward size={34} className="text-zinc-300 hover:text-white" />
        </button>

        <button onClick={toggleRepeat}>
          {repeat === "all" && <Repeat size={26} className="text-white" />}
          {repeat === "one" && <Repeat1 size={26} className="text-white" />}
          {repeat === "off" && <Repeat size={26} className="text-zinc-400" />}
        </button>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex items-center gap-3 mt-8 px-4"
      >
        <span className="text-sm text-zinc-500 w-10">{format(currentTime)}</span>

        <div
          className="flex-1 h-2 bg-zinc-700 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seek(ratio);
          }}
        >
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <span className="text-sm text-zinc-500 w-10 text-right">
          {format(duration)}
        </span>
      </motion.div>

      {/* Volume */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 mt-8 mx-auto w-64"
      >
        <span className="text-zinc-400">🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-white"
        />
      </motion.div>
    </motion.div>
  );
}
