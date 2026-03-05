import { Music2 } from "lucide-react";

export function ArtistCard({ artist }: { artist: any }) {
  return (
    <div className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl cursor-pointer transition-all text-center">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-zinc-800 mx-auto mb-3 ring-2 ring-white/5 group-hover:ring-emerald-500/30 transition-all">
        {artist.picture ? (
          <img src={artist.picture} alt={artist.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 size={28} className="text-zinc-600" />
          </div>
        )}
      </div>
      <p className="text-sm font-semibold truncate">{artist.name}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{artist.followers} followers</p>
    </div>
  );
}
