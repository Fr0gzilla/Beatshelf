"use client";

import { usePlayerStore } from "@/store/playerStore";
import { X, ListMusic, Trash2, Play, AudioLines } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function QueuePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queue = usePlayerStore((s) => s.queue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const playlist = usePlayerStore((s) => s.playlist);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);

  const upcoming = playlist.slice(currentIndex + 1);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#111118] border-l border-white/[0.06] z-[61] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <ListMusic size={18} className="text-purple-400" />
                <h2 className="text-base font-bold">Queue</h2>
              </div>
              <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              {/* Now playing */}
              {currentTrack && (
                <div className="mb-5">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium px-2 mb-2">Now playing</p>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                      {currentTrack.cover ? (
                        <Image src={currentTrack.cover} alt={currentTrack.title} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><AudioLines size={14} className="text-zinc-700" /></div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-purple-300 truncate">{currentTrack.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{currentTrack.artist}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Queue */}
              {queue.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">In queue</p>
                    <button type="button" onClick={clearQueue} className="text-[11px] text-zinc-600 hover:text-red-400 transition-colors flex items-center gap-1">
                      <Trash2 size={11} /> Clear
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {queue.map((track, i) => (
                      <div key={`q-${track.id}-${i}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                          {track.cover ? <Image src={track.cover} alt={track.title} width={36} height={36} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><AudioLines size={12} className="text-zinc-700" /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium truncate">{track.title}</p>
                          <p className="text-[11px] text-zinc-600 truncate">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Up next from playlist */}
              {upcoming.length > 0 && (
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium px-2 mb-2">Up next</p>
                  <div className="space-y-0.5">
                    {upcoming.slice(0, 20).map((track, i) => (
                      <button
                        key={`up-${track.id}-${i}`}
                        type="button"
                        onClick={() => playPlaylist(playlist, currentIndex + 1 + i)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors text-left group"
                      >
                        <span className="text-[11px] text-zinc-700 w-4 text-right">{i + 1}</span>
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                          {track.cover ? <Image src={track.cover} alt={track.title} width={36} height={36} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><AudioLines size={12} className="text-zinc-700" /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium truncate">{track.title}</p>
                          <p className="text-[11px] text-zinc-600 truncate">{track.artist}</p>
                        </div>
                        <Play size={12} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {queue.length === 0 && upcoming.length === 0 && (
                <div className="text-center py-12 text-zinc-600">
                  <ListMusic size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Queue is empty</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
