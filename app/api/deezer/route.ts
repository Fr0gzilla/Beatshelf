import { NextRequest, NextResponse } from "next/server";

// In-memory cache with TTL
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cleanExpired() {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expires < now) cache.delete(key);
  }
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path param" }, { status: 400 });
  }

  // Check cache
  const now = Date.now();
  const cached = cache.get(path);
  if (cached && cached.expires > now) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const res = await fetch(`https://api.deezer.com${path}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Deezer API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Store in cache
    cache.set(path, { data, expires: now + CACHE_TTL });

    // Periodic cleanup
    if (cache.size > 100) cleanExpired();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from Deezer" },
      { status: 502 }
    );
  }
}
