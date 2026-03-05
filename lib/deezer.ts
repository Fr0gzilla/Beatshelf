import { Track } from "@/store/playerStore";

export type DeezerTrack = {
  id: number;
  title: string;
  preview: string;
  duration: number;
  artist: { id: number; name: string; picture_medium: string };
  album: { id: number; title: string; cover_medium: string; cover_small: string };
};

export function deezerToTrack(d: DeezerTrack): Track {
  return {
    id: String(d.id),
    title: d.title,
    artist: d.artist.name,
    url: d.preview,
    cover: d.album.cover_medium,
  };
}
