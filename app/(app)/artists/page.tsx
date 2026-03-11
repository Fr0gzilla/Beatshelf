"use client";

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { deezerToTrack, DeezerTrack } from "@/lib/deezer";
import type { Track } from "@/store/playerStore";
import { Mic2, Loader2, Play, X } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import Image from "next/image";

type DeezerArtist = {
  id: number;
  name: string;
  picture_medium: string;
  nb_fan: number;
};

const categories = [
  { label: "Top Charts", query: null },
  { label: "Rap", query: "rap" },
  { label: "Pop", query: "pop" },
  { label: "R&B", query: "rnb" },
  { label: "Rock", query: "rock" },
  { label: "Electro", query: "electronic" },
  { label: "Latino", query: "reggaeton" },
  { label: "Jazz", query: "jazz" },
];

function formatFans(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M fans`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K fans`;
  return `${n} fans`;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<DeezerArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<DeezerArtist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const playTrack = usePlayerStore((s) => s.playTrack);

  useEffect(() => {
    setLoading(true);
    setArtists([]);

    const cat = categories[activeTab];
    const path = cat.query
      ? `/search/artist?q=${encodeURIComponent(cat.query)}&limit=50`
      : "/chart/0/artists?limit=50";

    fetch(`/api/deezer?path=${encodeURIComponent(path)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setArtists(data.data);
        }
      })
      .catch(() => { toast("Failed to load artists", "error"); })
      .finally(() => setLoading(false));
  }, [activeTab]);

  const openArtist = (artist: DeezerArtist) => {
    setSelectedArtist(artist);
    setLoadingTracks(true);
    setTopTracks([]);

    fetch(`/api/deezer?path=${encodeURIComponent(`/artist/${artist.id}/top?limit=10`)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setTopTracks(data.data.map((t: DeezerTrack) => deezerToTrack(t)));
        }
      })
      .catch(() => { toast("Failed to load artists", "error"); })
      .finally(() => setLoadingTracks(false));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 right-0 w-[500px] h-[250px] bg-pink-500/[0.08] rounded-full blur-[120px] -translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-1">
            <Mic2 size={22} className="text-pink-400" />
            <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
          </div>
          <p className="text-sm text-zinc-500">Discover artists from around the world</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 md:px-10 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeTab === i
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] border border-white/[0.06]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Artist grid */}
      <div className="px-6 md:px-10 pb-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-pink-400" />
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {artists.map((artist, i) => (
              <button
                key={artist.id}
                type="button"
                onClick={() => openArtist(artist)}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] p-5 pt-6 rounded-2xl cursor-pointer text-center border border-transparent hover:border-white/[0.08] hover:shadow-xl hover:shadow-pink-500/5 transition-[background,border,box-shadow] duration-200"
              >
                {/* Rank badge for top 10 */}
                {i < 10 && (
                  <span className="absolute top-3 left-3 text-[11px] font-bold text-zinc-600 bg-white/[0.06] w-6 h-6 rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                )}

                <div className="aspect-square w-28 md:w-32 rounded-full overflow-hidden bg-white/[0.04] mx-auto mb-4 ring-2 ring-pink-500/10 group-hover:ring-pink-500/40 group-hover:ring-4 transition-[ring] duration-200 shadow-lg shadow-black/20">
                  <Image
                    src={artist.picture_medium}
                    alt={artist.name}
                    width={128} height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <p className="text-sm font-semibold truncate">{artist.name}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{formatFans(artist.nb_fan)}</p>

              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-600">
            <Mic2 size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No artists found</p>
          </div>
        )}
      </div>

      {/* Artist detail modal */}
      {selectedArtist && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedArtist(null)} />
          <div className="relative bg-zinc-900 border border-white/[0.08] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <button
              type="button"
              onClick={() => setSelectedArtist(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-pink-500/30 mb-4">
                <Image src={selectedArtist.picture_medium} alt={selectedArtist.name} width={112} height={112} className="w-full h-full object-cover" unoptimized />
              </div>
              <h2 className="text-xl font-bold">{selectedArtist.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">{formatFans(selectedArtist.nb_fan)}</p>

              {topTracks.length > 0 && (
                <button
                  type="button"
                  onClick={() => playPlaylist(topTracks, 0)}
                  className="mt-4 flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-500/20"
                >
                  <Play size={14} fill="white" />
                  Play all
                </button>
              )}
            </div>

            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Top tracks</h3>

            {loadingTracks ? (
              <div className="flex justify-center py-8">
                <Loader2 size={22} className="animate-spin text-pink-400" />
              </div>
            ) : topTracks.length > 0 ? (
              <div className="space-y-1">
                {topTracks.map((track, i) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => { playPlaylist(topTracks, i); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-all text-left group"
                  >
                    <span className="text-[11px] text-zinc-600 w-5 text-right">{i + 1}</span>
                    <Image src={track.cover || ""} alt={track.title} width={40} height={40} className="w-10 h-10 rounded-lg object-cover" unoptimized />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-[11px] text-zinc-600 truncate">{track.artist}</p>
                    </div>
                    <Play size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-zinc-600 py-4">No tracks available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
