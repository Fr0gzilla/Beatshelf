"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const { togglePlay, nextTrack, prevTrack, setVolume, volume, seek, progress } = usePlayerStore.getState();

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          if (e.shiftKey) {
            nextTrack();
          } else {
            seek(Math.min(1, progress + 0.05));
          }
          break;
        case "ArrowLeft":
          if (e.shiftKey) {
            prevTrack();
          } else {
            seek(Math.max(0, progress - 0.05));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case "KeyM":
          setVolume(volume === 0 ? 1 : 0);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
