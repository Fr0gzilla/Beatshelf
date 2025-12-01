import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user_id, track_id } = await req.json();

  const { error } = await supabase
    .from("history")
    .insert({ user_id, track_id });

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
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

  // INSERT into DB
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
