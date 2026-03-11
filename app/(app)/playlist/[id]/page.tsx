"use client";

import { use, useState, useEffect } from "react";
import { TrackCard } from "@/components/music/TrackCard";
import { usePlayerStore } from "@/store/playerStore";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";
import { Loader2, Play, Music, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PlaylistData = {
  id: number;
  title: string;
  picture_medium: string;
  picture_big: string;
  nb_tracks: number;
  creator: { name: string };
  tracks: { data: DeezerTrack[] };
};

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/deezer?path=${encodeURIComponent(`/playlist/${id}`)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(true);
          return;
        }
        setPlaylist(data);
        if (data.tracks?.data) {
          setTracks(data.tracks.data.map((t: DeezerTrack) => deezerToTrack(t)));
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="text-center py-24 text-zinc-600">
        <Music size={40} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm">Playlist not found</p>
        <button type="button" onClick={() => router.back()} className="text-xs text-purple-400 hover:underline mt-3">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-purple-500/[0.07] rounded-full blur-[100px] -translate-y-1/2" />
        <div className="relative">
          <button type="button" onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
            <ChevronLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-6">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 shrink-0 bg-white/[0.04]">
              <Image src={playlist.picture_big || playlist.picture_medium} alt={playlist.title}
                width={176} height={176} className="w-full h-full object-cover" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Playlist</p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1 truncate">{playlist.title}</h1>
              <p className="text-sm text-zinc-400 mt-1.5">by {playlist.creator.name}</p>
              <p className="text-[11px] text-zinc-600 mt-1">{playlist.nb_tracks} tracks</p>
              {tracks.length > 0 && (
                <button type="button" onClick={() => playPlaylist(tracks, 0)}
                  className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20">
                  <Play size={14} fill="white" /> Play all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-12">
        <div className="space-y-1">
          {tracks.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
