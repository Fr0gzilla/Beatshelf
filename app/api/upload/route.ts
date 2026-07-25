import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const MAX_AUDIO_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_COVER_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_AUDIO = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
];
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Never trust the client-supplied filename: keep only a short, safe extension.
function safeExt(name: string, fallback: string): string {
  const m = /\.([a-z0-9]{1,5})$/i.exec(name);
  return m ? `.${m[1].toLowerCase()}` : fallback;
}

export async function POST(req: Request) {
  // 1) Authentication — require a valid Supabase session (Bearer token from the client)
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Request-scoped client acting AS the caller, so Storage/DB Row-Level Security applies.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse and validate the payload
  const formData = await req.formData();
  const audio = formData.get("audio");
  const cover = formData.get("cover");
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const artist = (formData.get("artist") as string | null)?.trim() ?? "";

  if (!(audio instanceof File) || !(cover instanceof File) || !title || !artist) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (title.length > 200 || artist.length > 200) {
    return NextResponse.json({ error: "Title or artist too long" }, { status: 400 });
  }
  if (!ALLOWED_AUDIO.includes(audio.type)) {
    return NextResponse.json({ error: "Unsupported audio format" }, { status: 415 });
  }
  if (!ALLOWED_IMAGE.includes(cover.type)) {
    return NextResponse.json({ error: "Unsupported cover format" }, { status: 415 });
  }
  if (audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "Audio file too large (max 50 MB)" }, { status: 413 });
  }
  if (cover.size === 0 || cover.size > MAX_COVER_BYTES) {
    return NextResponse.json({ error: "Cover file too large (max 5 MB)" }, { status: 413 });
  }

  // 3) Store under server-generated keys (client filename is never used as-is)
  const audioName = `audio/${crypto.randomUUID()}${safeExt(audio.name, ".mp3")}`;
  const coverName = `covers/${crypto.randomUUID()}${safeExt(cover.name, ".jpg")}`;

  const { error: audioErr } = await supabase.storage
    .from("tracks")
    .upload(audioName, audio, { contentType: audio.type, upsert: false });

  const { error: coverErr } = await supabase.storage
    .from("tracks")
    .upload(coverName, cover, { contentType: cover.type, upsert: false });

  if (audioErr || coverErr) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const audioURL = supabase.storage.from("tracks").getPublicUrl(audioName);
  const coverURL = supabase.storage.from("tracks").getPublicUrl(coverName);

  const { error: insertErr } = await supabase.from("tracks").insert({
    title,
    artist,
    url: audioURL.data.publicUrl,
    cover: coverURL.data.publicUrl,
  });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
