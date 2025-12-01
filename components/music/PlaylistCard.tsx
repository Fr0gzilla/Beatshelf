export function PlaylistCard({ playlist }: { playlist: any }) {
  return (
    <div className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-lg cursor-pointer transition">
      <img
        src={playlist.cover}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <p className="font-semibold">{playlist.name}</p>
      <p className="text-sm text-zinc-400">{playlist.tracks} tracks</p>
    </div>
  );
}
