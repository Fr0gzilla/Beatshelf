"use client";

import { use, useState, useEffect } from "react";
import { TrackCard } from "@/components/music/TrackCard";
import { usePlayerStore } from "@/store/playerStore";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";
import { Loader2, Play, Mic2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type ArtistData = {
  id: number;
  name: string;
  picture_big: string;
  picture_medium: string;
  nb_fan: number;
  nb_album: number;
};

type DeezerAlbum = {
  id: number;
  title: string;
  cover_medium: string;
  release_date: string;
};

function formatFans(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M fans`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K fans`;
  return `${n} fans`;
}

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<DeezerAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/deezer?path=${encodeURIComponent(`/artist/${id}`)}`).then((r) => r.json()),
      fetch(`/api/deezer?path=${encodeURIComponent(`/artist/${id}/top?limit=10`)}`).then((r) => r.json()),
      fetch(`/api/deezer?path=${encodeURIComponent(`/artist/${id}/albums?limit=20`)}`).then((r) => r.json()),
    ])
      .then(([artistData, tracksData, albumsData]) => {
        if (artistData.error) {
          setError(true);
          return;
        }
        setArtist(artistData);
        if (tracksData.data) {
          setTopTracks(tracksData.data.map((t: DeezerTrack) => deezerToTrack(t)));
        }
        if (albumsData.data) {
          setAlbums(albumsData.data);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-pink-400" />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="text-center py-24 text-zinc-600">
        <Mic2 size={40} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm">Artist not found</p>
        <button type="button" onClick={() => router.back()} className="text-xs text-purple-400 hover:underline mt-3">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 right-0 w-[500px] h-[250px] bg-pink-500/[0.08] rounded-full blur-[120px] -translate-y-1/2" />
        <div className="relative">
          <button type="button" onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
            <ChevronLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-6">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-2xl shadow-pink-900/20 shrink-0 bg-white/[0.04] ring-2 ring-pink-500/20">
              <Image src={artist.picture_big || artist.picture_medium} alt={artist.name}
                width={176} height={176} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Artist</p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">{artist.name}</h1>
              <p className="text-sm text-zinc-400 mt-1.5">{formatFans(artist.nb_fan)} &middot; {artist.nb_album} albums</p>
              {topTracks.length > 0 && (
                <button type="button" onClick={() => playPlaylist(topTracks, 0)}
                  className="mt-4 flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-500/20">
                  <Play size={14} fill="white" /> Play top tracks
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top tracks */}
      {topTracks.length > 0 && (
        <div className="px-6 md:px-10 pb-8">
          <h2 className="text-lg font-bold mb-4">Top Tracks</h2>
          <div className="space-y-1">
            {topTracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <div className="px-6 md:px-10 pb-12">
          <h2 className="text-lg font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <Link key={album.id} href={`/album/${album.id}`}
                className="group bg-white/[0.03] hover:bg-white/[0.06] p-3 rounded-2xl transition-all border border-transparent hover:border-white/[0.06]">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-white/[0.04] mb-3">
                  <Image src={album.cover_medium} alt={album.title}
                    width={200} height={200} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-orange-400 rounded-full flex items-center justify-center shadow-xl translate-y-3 group-hover:translate-y-0 transition-transform">
                      <Play size={17} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <p className="text-[13px] font-semibold truncate">{album.title}</p>
                <p className="text-[11px] text-zinc-600 truncate mt-0.5">{album.release_date?.split("-")[0]}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
