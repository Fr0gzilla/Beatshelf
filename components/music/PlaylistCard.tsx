import { Play, Music2 } from "lucide-react";

export function PlaylistCard({ playlist }: { playlist: any }) {
  return (
    <div className="group bg-white/5 hover:bg-white/10 p-3 rounded-xl cursor-pointer transition-all">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 mb-3">
        {playlist.cover ? (
          <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 size={28} className="text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play size={18} className="text-black ml-0.5" fill="black" />
          </div>
        </div>
      </div>
      <p className="text-sm font-semibold truncate">{playlist.name}</p>
      <p className="text-xs text-zinc-500 truncate mt-0.5">{playlist.tracks} tracks</p>
    </div>
  );
}
