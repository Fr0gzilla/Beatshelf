"use client";

import { useState } from "react";
import { Upload, Music, Image, CheckCircle, AudioLines } from "lucide-react";

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
      <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-6">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-orange-500/[0.08] rounded-full blur-[100px] -translate-y-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight">Upload</h1>
          <p className="text-sm text-zinc-600 mt-1">Drop your beats on the shelf</p>
        </div>
      </div>

      <div className="px-6 md:px-10 py-6 max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Title</label>
            <input type="text" placeholder="Track title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Artist</label>
            <input type="text" placeholder="Artist name" value={artist} onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all" />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Audio</label>
            <label className="flex items-center gap-3 bg-white/[0.03] border border-dashed border-white/[0.08] rounded-2xl px-4 py-5 cursor-pointer hover:bg-white/[0.06] hover:border-purple-500/30 transition-all">
              {audio ? <CheckCircle size={18} className="text-purple-400 shrink-0" /> : <Music size={18} className="text-zinc-600 shrink-0" />}
              <span className="text-sm text-zinc-500 truncate">{audio ? audio.name : "Choose audio file..."}</span>
              <input type="file" className="hidden" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Cover</label>
            <label className="flex items-center gap-3 bg-white/[0.03] border border-dashed border-white/[0.08] rounded-2xl px-4 py-5 cursor-pointer hover:bg-white/[0.06] hover:border-purple-500/30 transition-all">
              {cover ? <CheckCircle size={18} className="text-purple-400 shrink-0" /> : <Image size={18} className="text-zinc-600 shrink-0" />}
              <span className="text-sm text-zinc-500 truncate">{cover ? cover.name : "Choose cover image..."}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>

        <button type="button" onClick={upload} disabled={loading || !title || !artist || !audio || !cover}
          className="mt-8 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-purple-500/20 disabled:shadow-none">
          <Upload size={15} />
          {loading ? "Uploading..." : "Upload beat"}
        </button>
      </div>
    </div>
  );
}
