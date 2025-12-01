"use client";

import { useState } from "react";

export default function UploadPage() {
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  async function upload() {
    if (!audio || !cover) return alert("Missing files");

    const form = new FormData();
    form.append("audio", audio);
    form.append("cover", cover);
    form.append("title", title);
    form.append("artist", artist);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (data.error) alert(data.error);
    else alert("Upload successful!");
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Upload Track</h1>

      <input
        type="text"
        placeholder="Title"
        className="p-3 bg-zinc-800 rounded w-full mb-3"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Artist"
        className="p-3 bg-zinc-800 rounded w-full mb-3"
        onChange={(e) => setArtist(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] || null)}
      />

      <input
        type="file"
        className="mb-3"
        accept="image/*"
        onChange={(e) => setCover(e.target.files?.[0] || null)}
      />

      <button
        onClick={upload}
        className="px-6 py-3 bg-white text-black rounded font-bold"
      >
        Upload
      </button>
    </div>
  );
}
