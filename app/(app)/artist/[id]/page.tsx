"use client";

import { use } from "react";
import { artists } from "@/lib/data";
import { AlbumCard } from "@/components/music/AlbumCard";

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const artist = artists.find((a) => a.id === id);

  if (!artist) return <div className="p-6">Artist not found</div>;

  return (
    <div className="p-6">

      {/* HEADER ARTIST */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src={artist.picture}
          className="w-40 h-40 rounded-full object-cover"
        />

        <div>
          <p className="text-sm uppercase text-zinc-400">Artist</p>
          <h1 className="text-4xl font-bold">{artist.name}</h1>
          <p className="text-zinc-400 mt-2">
            {artist.followers} followers
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Albums</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {artist.albums.map((a, i) => (
          <AlbumCard key={i} album={a} />
        ))}
      </div>

    </div>
  );
}
