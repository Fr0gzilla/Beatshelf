"use client";

import { useState } from "react";
import { Upload, Music, Image, CheckCircle } from "lucide-react";

export default function UploadPage() {
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!audio || !cover) return alert("Missing files");

    setLoading(true);
    const form = new FormData();
    form.append("audio", audio);
    form.append("cover", cover);
    form.append("title", title);
    form.append("artist", artist);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);

    if (data.error) alert(data.error);
    else alert("Upload successful!");
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent" />

        <div className="relative px-6 md:px-10 pt-10 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Upload Track</h1>
          <p className="text-sm text-zinc-500 mt-1">Share your music with the world</p>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 md:px-10 py-6 max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Title</label>
            <input
              type="text"
              placeholder="Track title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Artist</label>
            <input
              type="text"
              placeholder="Artist name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Audio file */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Audio file</label>
            <label className="flex items-center gap-3 bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:bg-white/10 hover:border-emerald-500/30 transition-all">
              {audio ? (
                <CheckCircle size={18} className="text-emerald-400 shrink-0" />
              ) : (
                <Music size={18} className="text-zinc-500 shrink-0" />
              )}
              <span className="text-sm text-zinc-400 truncate">
                {audio ? audio.name : "Choose audio file..."}
              </span>
              <input
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Cover file */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Cover image</label>
            <label className="flex items-center gap-3 bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:bg-white/10 hover:border-emerald-500/30 transition-all">
              {cover ? (
                <CheckCircle size={18} className="text-emerald-400 shrink-0" />
              ) : (
                <Image size={18} className="text-zinc-500 shrink-0" />
              )}
              <span className="text-sm text-zinc-400 truncate">
                {cover ? cover.name : "Choose cover image..."}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={upload}
          disabled={loading || !title || !artist || !audio || !cover}
          className="mt-8 flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-semibold py-3 rounded-xl transition-colors"
        >
          <Upload size={16} />
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
