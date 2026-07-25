import { NextRequest, NextResponse } from "next/server";

// In-memory cache with TTL.
// NOTE: per-instance and ephemeral on serverless (Render/Vercel) — best effort only.
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const DEEZER_ORIGIN = "https://api.deezer.com";
const ALLOWED_ENDPOINTS = new Set([
  "search",
  "album",
  "artist",
  "track",
  "playlist",
  "chart",
  "genre",
  "editorial",
  "radio",
]);

function cleanExpired() {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expires < now) cache.delete(key);
  }
}

// Prevents SSRF: the resolved URL must stay on the Deezer API host,
// and the first path segment must be an allowlisted endpoint.
function resolveDeezerUrl(rawPath: string): URL | null {
  let url: URL;
  try {
    url = new URL(rawPath, DEEZER_ORIGIN);
  } catch {
    return null;
  }
  if (url.origin !== DEEZER_ORIGIN) return null;
  const segment = url.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (!segment || !ALLOWED_ENDPOINTS.has(segment)) return null;
  return url;
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path param" }, { status: 400 });
  }

  const target = resolveDeezerUrl(path);
  if (!target) {
    return NextResponse.json({ error: "Invalid or disallowed path" }, { status: 400 });
  }

  const now = Date.now();
  const cacheKey = target.pathname + target.search;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > now) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const res = await fetch(target, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Deezer API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    cache.set(cacheKey, { data, expires: now + CACHE_TTL });
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
