"use client";

import { useState, useEffect } from "react";
import { useLikesStore } from "@/store/likesStore";
import { usePlaylistStore, getPlaylistStyle } from "@/store/playlistStore";
import { usePlayerStore } from "@/store/playerStore";
import { useHistoryStore } from "@/store/historyStore";
import { TrackCard } from "@/components/music/TrackCard";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";
import { Heart, Play, Library, Music, Clock, ChevronLeft, Plus, X, Trash2 } from "lucide-react";

type PresetPlaylist = {
  name: string;
  emoji: string;
  gradient: string;
  shadow: string;
  query: string;
};

const presetPlaylists: PresetPlaylist[] = [
  {
    name: "Summer Vibes",
    emoji: "\u2600\uFE0F",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-orange-500/20",
    query: "summer chill beach",
  },
  {
    name: "Late Night",
    emoji: "\uD83C\uDF19",
    gradient: "from-indigo-600 to-violet-600",
    shadow: "shadow-violet-500/20",
    query: "lofi chill night",
  },
];

const EMOJIS = ["\uD83C\uDFB5", "\uD83C\uDFB6", "\uD83D\uDD25", "\u2B50", "\uD83D\uDC9C", "\uD83C\uDF0A", "\uD83C\uDF1F", "\uD83C\uDFAF", "\uD83D\uDE80", "\uD83C\uDF42", "\uD83C\uDF08", "\u26A1"];

export default function LibraryPage() {
  const liked = useLikesStore((s) => s.liked);
  const userPlaylists = usePlaylistStore((s) => s.playlists);
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist);
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const history = useHistoryStore((s) => s.history);

  const [presetTracks, setPresetTracks] = useState<Record<string, Track[]>>({});
  const [loadingPresets, setLoadingPresets] = useState(true);
  const [openPlaylist, setOpenPlaylist] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState(EMOJIS[0]);

  // Load preset playlist tracks
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      presetPlaylists.map((pl) =>
        fetch(`/api/deezer?path=${encodeURIComponent(`/search?q=${encodeURIComponent(pl.query)}&limit=15`)}`)
          .then((r) => r.json())
          .then((data) => ({
            name: pl.name,
            tracks: data.data ? data.data.map((t: DeezerTrack) => deezerToTrack(t)) : [],
          }))
          .catch(() => ({ name: pl.name, tracks: [] }))
      )
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, Track[]> = {};
      results.forEach((r) => { map[r.name] = r.tracks; });
      setPresetTracks(map);
      setLoadingPresets(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPlaylist(newName.trim(), newEmoji);
    setNewName("");
    setNewEmoji(EMOJIS[0]);
    setShowCreate(false);
  };

  // Resolve tracks for opened playlist
  const getOpenTracks = (): Track[] => {
    if (!openPlaylist) return [];
    if (openPlaylist === "liked") return liked;
    const preset = presetPlaylists.find((p) => p.name === openPlaylist);
    if (preset) return presetTracks[openPlaylist] || [];
    const userPl = userPlaylists.find((p) => p.id === openPlaylist);
    return userPl?.tracks || [];
  };

  const getOpenMeta = () => {
    if (!openPlaylist) return null;
    if (openPlaylist === "liked") {
      return { title: "Titres lik\u00e9s", gradient: "from-pink-500 to-purple-600", shadow: "shadow-pink-500/20", cover: <Heart size={32} className="text-white" fill="white" />, isUser: false, id: "liked" };
    }
    const preset = presetPlaylists.find((p) => p.name === openPlaylist);
    if (preset) {
      return { title: preset.name, gradient: preset.gradient, shadow: preset.shadow, cover: <span className="text-3xl">{preset.emoji}</span>, isUser: false, id: openPlaylist };
    }
    const idx = userPlaylists.findIndex((p) => p.id === openPlaylist);
    const userPl = userPlaylists[idx];
    if (userPl) {
      const style = getPlaylistStyle(idx);
      return { title: userPl.name, gradient: style.gradient, shadow: style.shadow, cover: <span className="text-3xl">{userPl.emoji}</span>, isUser: true, id: userPl.id };
    }
    return null;
  };

  // Detail view
  if (openPlaylist) {
    const meta = getOpenMeta();
    const tracks = getOpenTracks();
    if (!meta) { setOpenPlaylist(null); return null; }

    return (
      <div className="min-h-screen">
        <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-purple-500/[0.07] rounded-full blur-[100px] -translate-y-1/2" />
          <div className="relative">
            <button type="button" onClick={() => setOpenPlaylist(null)}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-4">
              <ChevronLeft size={16} /> Library
            </button>
            <div className="flex items-center gap-5">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 shadow-lg ${meta.shadow}`}>
                {meta.cover}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Playlist</p>
                <h2 className="text-xl md:text-2xl font-bold mt-0.5">{meta.title}</h2>
                <p className="text-sm text-zinc-500 mt-1">{tracks.length} titres</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {meta.isUser && (
                  <button type="button" onClick={() => { deletePlaylist(meta.id); setOpenPlaylist(null); }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={16} />
                  </button>
                )}
                {tracks.length > 0 && (
                  <button type="button" onClick={() => playPlaylist(tracks, 0)}
                    className={`flex items-center gap-2 bg-gradient-to-r ${meta.gradient} text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${meta.shadow}`}>
                    <Play size={14} fill="white" /> Play
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 md:px-10 pb-12">
          {tracks.length > 0 ? (
            <div className="space-y-1">
              {tracks.map((track, i) => (
                <TrackCard key={track.id} track={track} index={i + 1} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-600">
              <Music size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun titre dans cette playlist</p>
              <p className="text-[11px] text-zinc-700 mt-1">Ajoute des titres depuis la recherche ou le trending</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 left-1/3 w-[400px] h-[200px] bg-purple-500/[0.07] rounded-full blur-[100px] -translate-y-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Library size={22} className="text-purple-400" />
              <h1 className="text-3xl font-bold tracking-tight">Library</h1>
            </div>
            <p className="text-sm text-zinc-500">Your personal collection</p>
          </div>
          <button type="button" onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
            <Plus size={16} />
            Nouvelle playlist
          </button>
        </div>
      </div>

      {/* Playlist cards */}
      <div className="px-6 md:px-10 pb-8 space-y-3">
        {/* Liked */}
        <button type="button" onClick={() => setOpenPlaylist("liked")}
          className="w-full relative overflow-hidden bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-transparent border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] transition-all text-left">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-pink-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/20">
              <Heart size={22} className="text-white" fill="white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold">Titres lik&eacute;s</h3>
              <p className="text-[12px] text-zinc-500 mt-0.5">{liked.length} {liked.length === 1 ? "titre" : "titres"}</p>
            </div>
            {liked.length > 0 && (
              <div onClick={(e) => { e.stopPropagation(); playPlaylist(liked, 0); }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform shrink-0">
                <Play size={14} fill="white" className="text-white ml-0.5" />
              </div>
            )}
          </div>
        </button>

        {/* Preset playlists */}
        {presetPlaylists.map((pl) => {
          const tracks = presetTracks[pl.name] || [];
          return (
            <button key={pl.name} type="button" onClick={() => setOpenPlaylist(pl.name)}
              className="w-full relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] hover:bg-white/[0.05] transition-all text-left">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pl.gradient} flex items-center justify-center shrink-0 shadow-lg ${pl.shadow}`}>
                  <span className="text-2xl">{pl.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold">{pl.name}</h3>
                  <p className="text-[12px] text-zinc-500 mt-0.5">
                    {loadingPresets ? "Chargement..." : `${tracks.length} titres`}
                  </p>
                </div>
                {tracks.length > 0 && (
                  <div onClick={(e) => { e.stopPropagation(); playPlaylist(tracks, 0); }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${pl.gradient} flex items-center justify-center shadow-lg ${pl.shadow} hover:scale-105 transition-transform shrink-0`}>
                    <Play size={14} fill="white" className="text-white ml-0.5" />
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* User playlists */}
        {userPlaylists.map((pl, idx) => {
          const style = getPlaylistStyle(idx);
          return (
            <button key={pl.id} type="button" onClick={() => setOpenPlaylist(pl.id)}
              className="w-full relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] hover:bg-white/[0.05] transition-all text-left">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shrink-0 shadow-lg ${style.shadow}`}>
                  <span className="text-2xl">{pl.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold">{pl.name}</h3>
                  <p className="text-[12px] text-zinc-500 mt-0.5">{pl.tracks.length} titres</p>
                </div>
                {pl.tracks.length > 0 && (
                  <div onClick={(e) => { e.stopPropagation(); playPlaylist(pl.tracks, 0); }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center shadow-lg ${style.shadow} hover:scale-105 transition-transform shrink-0`}>
                    <Play size={14} fill="white" className="text-white ml-0.5" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent history */}
      {history.length > 0 && (
        <div className="px-6 md:px-10 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-400">Recently played</h3>
          </div>
          <div className="space-y-1">
            {history.slice(0, 8).map((track, i) => (
              <TrackCard key={`h-${track.id}-${i}`} track={track} />
            ))}
          </div>
        </div>
      )}

      {/* Create playlist modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-zinc-900 border border-white/[0.08] rounded-3xl w-full max-w-sm p-6 mx-4">
            <button type="button" onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold mb-5">Nouvelle playlist</h2>

            {/* Emoji picker */}
            <p className="text-[12px] text-zinc-500 mb-2">Choisis une ic&ocirc;ne</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => setNewEmoji(e)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                    newEmoji === e ? "bg-purple-500/20 ring-2 ring-purple-500/50" : "bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}>
                  {e}
                </button>
              ))}
            </div>

            {/* Name input */}
            <input
              type="text"
              placeholder="Nom de la playlist"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all mb-5"
              autoFocus
            />

            <button type="button" onClick={handleCreate}
              disabled={!newName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all">
              Cr&eacute;er
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
