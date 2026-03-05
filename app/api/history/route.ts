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
