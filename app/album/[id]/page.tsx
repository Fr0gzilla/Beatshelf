"use client";

import { use } from "react";
import { albums } from "@/lib/data";
import { TrackCard } from "@/components/music/TrackCard";

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const album = albums.find((a) => a.id === id);

  if (!album) return <div className="p-6">Album not found</div>;

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src={album.cover}
          alt={album.title}
          className="w-40 h-40 rounded shadow-lg object-cover"
        />

        <div>
          <p className="text-sm uppercase text-zinc-400">Album</p>
          <h1 className="text-4xl font-bold">{album.title}</h1>
          <p className="text-zinc-400 mt-2">{album.artist}</p>
        </div>
      </div>

      {/* TRACK LIST */}
      <div className="space-y-3">
        {album.tracks.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </div>

    </div>
  );
}
