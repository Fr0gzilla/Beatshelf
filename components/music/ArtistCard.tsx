export function ArtistCard({ artist }: { artist: any }) {
  return (
    <div className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-lg cursor-pointer transition text-center">
      <img
        src={artist.picture}
        className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
      />
      <p className="font-semibold">{artist.name}</p>
      <p className="text-sm text-zinc-400">{artist.followers} followers</p>
    </div>
  );
}
