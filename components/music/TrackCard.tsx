"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Plus, Heart, AudioLines, ListPlus, Share2 } from "lucide-react";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { useLikesStore } from "@/store/likesStore";
import { usePlaylistStore } from "@/store/playlistStore";
import { toast } from "@/components/ui/Toast";

export function TrackCard({ track, index }: { track: any; index?: number }) {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isActive = currentTrack?.id === track.id;
  const liked = useLikesStore((s) => s.isLiked(track.id));
  const toggleLike = useLikesStore((s) => s.toggleLike);
  const playlists = usePlaylistStore((s) => s.playlists);
  const addToPlaylist = usePlaylistStore((s) => s.addToPlaylist);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${track.title} - ${track.artist}`;
    if (navigator.share) {
      navigator.share({ title: track.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast("Copied to clipboard", "info");
    }
  };

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-purple-500/10 border border-purple-500/20"
          : "hover:bg-white/[0.03] border border-transparent"
      }`}
      onClick={() => playPlaylist([track], 0)}
    >
      {/* Index or EQ bars */}
      <div className="w-7 flex items-center justify-center shrink-0">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-[2px] h-4">
            {[0, 0.15, 0.3].map((d, i) => (
              <div key={i} className="w-[2.5px] rounded-full eq-bar bg-purple-400" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        ) : index ? (
          <>
            <span className={`text-[13px] tabular-nums group-hover:hidden ${isActive ? "text-purple-400 font-bold" : "text-zinc-600"}`}>
              {index}
            </span>
            <Play size={13} className="hidden group-hover:block text-white" fill="white" />
          </>
        ) : (
          <Play size={13} className="text-zinc-600 group-hover:text-white transition-colors" />
        )}
      </div>

      {/* Cover */}
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/[0.05] shrink-0 ring-1 ring-white/[0.06] relative">
        {track.cover ? (
          <Image src={track.cover} alt={track.title} width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AudioLines size={14} className="text-zinc-700" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium truncate ${isActive ? "text-purple-300" : "text-zinc-200"}`}>
          {track.title}
        </p>
        <p className="text-[11px] text-zinc-600 truncate">{track.artist}</p>
      </div>

      {/* Like */}
      <button type="button" title={liked ? "Unlike" : "Like"}
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(track);
          toast(liked ? "Removed from likes" : "Added to likes");
        }}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          liked
            ? "text-pink-500"
            : "text-zinc-600 hover:text-pink-400 opacity-0 group-hover:opacity-100"
        }`}>
        <Heart size={14} fill={liked ? "currentColor" : "none"} />
      </button>

      {/* Share */}
      <button type="button" title="Share"
        onClick={handleShare}
        className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all">
        <Share2 size={13} />
      </button>

      {/* Add to playlist / queue */}
      <div className="relative" ref={menuRef}>
        <button type="button" title="Add to..."
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:text-purple-400 hover:bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-all">
          <Plus size={14} />
        </button>

        {showMenu && (
          <div className="absolute right-0 bottom-full mb-1 w-52 bg-[#1a1a24] border border-white/[0.08] rounded-xl shadow-xl shadow-black/30 py-1.5 z-50"
            onClick={(e) => e.stopPropagation()}>
            <button type="button"
              onClick={() => { addToQueue(track); toast("Added to queue", "info"); setShowMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors">
              <ListPlus size={14} /> Add to queue
            </button>
            {playlists.length > 0 && <div className="my-1 border-t border-white/[0.06]" />}
            {playlists.map((pl) => (
              <button key={pl.id} type="button"
                onClick={() => {
                  addToPlaylist(pl.id, track);
                  toast(`Added to ${pl.name}`);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                <span className="text-sm">{pl.emoji}</span> {pl.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
