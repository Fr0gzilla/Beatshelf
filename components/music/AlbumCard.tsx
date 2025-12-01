export function AlbumCard({ album }: { album: any }) {
  return (
    <div className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-lg cursor-pointer transition">
      <img
        src={album.cover}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <p className="font-semibold">{album.title}</p>
      <p className="text-sm text-zinc-400">{album.artist}</p>
    </div>
  );
}
