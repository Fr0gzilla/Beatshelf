"use client";

import { use } from "react";
import { playlists } from "@/lib/data";
import { TrackCard } from "@/components/music/TrackCard";

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) return <div className="p-6">Playlist not found</div>;

  return (
    <div className="p-6">

      <div className="flex items-center gap-6 mb-10">
        <img
          src={playlist.cover}
          className="w-40 h-40 rounded object-cover"
        />

        <div>
          <p className="text-sm uppercase text-zinc-400">Playlist</p>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="text-zinc-400 mt-2">{playlist.tracks.length} tracks</p>
        </div>
      </div>

      <div className="space-y-3">
        {playlist.tracks.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </div>

    </div>
  );
}
