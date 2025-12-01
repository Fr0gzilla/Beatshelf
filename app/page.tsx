"use client";

import { demoTracks } from "@/lib/tracks";
import { usePlayerStore } from "@/store/playerStore";

export default function Home() {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Home</h1>

      <button
        onClick={() => playPlaylist(demoTracks, 0)}
        className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600 mt-4"
      >
        Play playlist
      </button>
    </div>
  );
}
