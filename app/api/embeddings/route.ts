import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { track_id, title, artist } = await req.json();

  // Texte utilisé pour générer l'embedding
  const text = `${title} by ${artist}`;

  // Appel API OpenAI — Embeddings
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text
    })
  });

  const json = await response.json();

  if (!json.data) {
    return NextResponse.json({ error: "Embedding generation failed" }, { status: 400 });
  }

  const embedding = json.data[0].embedding;

  // Mise à jour Supabase
  const { error } = await supabase
    .from("tracks")
    .update({ embedding })
    .eq("id", track_id);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
