import { Play, AudioLines } from "lucide-react";

export function PlaylistCard({ playlist }: { playlist: any }) {
  return (
    <div className="group bg-white/[0.03] hover:bg-white/[0.06] p-3 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-white/[0.06]">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-white/[0.04] mb-3">
        {playlist.cover ? (
          <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><AudioLines size={24} className="text-zinc-700" /></div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-orange-400 rounded-full flex items-center justify-center shadow-xl translate-y-3 group-hover:translate-y-0 transition-transform">
            <Play size={17} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
      </div>
      <p className="text-[13px] font-semibold truncate">{playlist.name}</p>
      <p className="text-[11px] text-zinc-600 truncate mt-0.5">{playlist.tracks} tracks</p>
    </div>
  );
}
