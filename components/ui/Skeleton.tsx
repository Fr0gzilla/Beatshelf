"use client";

export function TrackSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl animate-pulse">
          <div className="w-7 h-4 bg-white/[0.04] rounded" />
          <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-3 bg-white/[0.06] rounded w-3/5" />
            <div className="h-2.5 bg-white/[0.04] rounded w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArtistSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white/[0.03] p-5 pt-6 rounded-2xl text-center animate-pulse">
          <div className="aspect-square w-28 md:w-32 rounded-full bg-white/[0.06] mx-auto mb-4" />
          <div className="h-3 bg-white/[0.06] rounded w-3/4 mx-auto mb-2" />
          <div className="h-2.5 bg-white/[0.04] rounded w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
}
