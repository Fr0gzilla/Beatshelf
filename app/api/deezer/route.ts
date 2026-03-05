import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path param" }, { status: 400 });
  }

  const res = await fetch(`https://api.deezer.com${path}`, {
    headers: { "Accept": "application/json" },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
