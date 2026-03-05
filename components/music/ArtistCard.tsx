import { AudioLines } from "lucide-react";

export function ArtistCard({ artist }: { artist: any }) {
  return (
    <div className="group bg-white/[0.03] hover:bg-white/[0.06] p-4 rounded-2xl cursor-pointer transition-all text-center border border-transparent hover:border-white/[0.06]">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white/[0.04] mx-auto mb-3 ring-2 ring-purple-500/10 group-hover:ring-purple-500/30 transition-all">
        {artist.picture ? (
          <img src={artist.picture} alt={artist.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><AudioLines size={24} className="text-zinc-700" /></div>
        )}
      </div>
      <p className="text-[13px] font-semibold truncate">{artist.name}</p>
      <p className="text-[11px] text-zinc-600 mt-0.5">{artist.followers} followers</p>
    </div>
  );
}
