import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const audio = formData.get("audio") as File | null;
  const cover = formData.get("cover") as File | null;
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;

  if (!audio || !cover || !title || !artist) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const audioName = `audio/${crypto.randomUUID()}-${audio.name}`;
  const coverName = `covers/${crypto.randomUUID()}-${cover.name}`;

  const { error: audioErr } = await supabase.storage
    .from("tracks")
    .upload(audioName, audio);

  const { error: coverErr } = await supabase.storage
    .from("tracks")
    .upload(coverName, cover);

  if (audioErr || coverErr) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const audioURL = supabase.storage.from("tracks").getPublicUrl(audioName);
  const coverURL = supabase.storage.from("tracks").getPublicUrl(coverName);

  const { error: insertErr } = await supabase
    .from("tracks")
    .insert({
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
