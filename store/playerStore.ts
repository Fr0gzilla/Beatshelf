import { create } from "zustand";
import { Howl } from "howler";

// ===============================
// Types
// ===============================
export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
};

type PlayerState = {
  playlist: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  howl: Howl | null;
  volume: number;
  progress: number;
  duration: number;

  // Queue
  queue: Track[];
  addToQueue: (track: Track) => void;
  clearQueue: () => void;

  // Shuffle & Repeat
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // Actions
  playTrack: (track: Track) => void;
  playPlaylist: (list: Track[], index: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;

  // Progress
  currentTime: number;
  updateProgress: () => void;
  seek: (ratio: number) => void;

  // Volume
  setVolume: (v: number) => void;

  // Fullscreen Player
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

// ===============================
// Player Store
// ===============================
export const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: [],
  currentIndex: 0,
  currentTrack: null,
  isPlaying: false,
  howl: null,
  volume: 1,
  progress: 0,
  duration: 0,

  // Queue
  queue: [],
  addToQueue: (track) =>
    set((state) => ({ queue: [...state.queue, track] })),
  clearQueue: () => set({ queue: [] }),

  // Shuffle
  shuffle: false,
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  // Repeat
  repeat: "off",
  toggleRepeat: () => {
    const current = get().repeat;
    const next =
      current === "off" ? "all" : current === "all" ? "one" : "off";
    set({ repeat: next });
  },

  // -------------------------------
  // Play a single track
  // -------------------------------
  playTrack: (track: Track) => {
    const oldHowl = get().howl;
    if (oldHowl) oldHowl.unload();

    const sound = new Howl({
      src: [track.url],
      html5: true,
      volume: get().volume,
      onend: () => {
        get().nextTrack();
      },
      onload: () => {
        set({
          duration: sound.duration(),
        });
      }
    });

    set({
      currentTrack: track,
      howl: sound,
      isPlaying: true,
      currentTime: 0,
      progress: 0,
    });

    sound.play();

    // Auto-update progress
    const interval = setInterval(() => {
      if (get().howl === sound && get().isPlaying) {
        get().updateProgress();
      } else if (get().howl !== sound) {
        clearInterval(interval);
      }
    }, 500);

  },

  // -------------------------------
  // Play an entire playlist
  // -------------------------------
  playPlaylist: (list, index) => {
    set({
      playlist: list,
      currentIndex: index,
    });

    const track = list[index];
    get().playTrack(track);
  },

  // -------------------------------
  // Play / Pause toggle
  // -------------------------------
  togglePlay: () => {
    const sound = get().howl;
    if (!sound) return;

    if (get().isPlaying) {
      sound.pause();
      set({ isPlaying: false });
    } else {
      sound.play();
      set({ isPlaying: true });
    }
  },

  // -------------------------------
  // Next Track (with Queue + Shuffle + Repeat)
  // -------------------------------
  nextTrack: () => {
    const {
      playlist,
      currentIndex,
      queue,
      shuffle,
      repeat
    } = get();

    // Queue prioritaire
    if (queue.length > 0) {
      const next = queue[0];
      set({ queue: queue.slice(1) });
      get().playPlaylist([next], 0);
      return;
    }

    // Repeat One
    if (repeat === "one") {
      get().playTrack(get().currentTrack!);
      return;
    }

    // Shuffle
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      get().playPlaylist(playlist, randomIndex);
      return;
    }

    // Normal next
    const nextIndex = currentIndex + 1;

    // Repeat All
    if (nextIndex >= playlist.length) {
      if (repeat === "all") {
        get().playPlaylist(playlist, 0);
      }
      return;
    }

    get().playPlaylist(playlist, nextIndex);
  },

  // -------------------------------
  // Previous Track
  // -------------------------------
  prevTrack: () => {
    const { currentIndex, playlist } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) return;
    get().playPlaylist(playlist, prevIndex);
  },

  // Progress
  currentTime: 0,

  // -------------------------------
  // Update progress
  // -------------------------------
  updateProgress: () => {
    const sound = get().howl;
    if (!sound) return;

    const dur = sound.duration();
    const cur = sound.seek() as number;
    set({
      currentTime: cur,
      progress: dur > 0 ? cur / dur : 0,
      duration: dur,
    });
  },

  // -------------------------------
  // Seek to ratio (0-1)
  // -------------------------------
  seek: (ratio: number) => {
    const sound = get().howl;
    if (!sound) return;

    const dur = sound.duration();
    const time = ratio * dur;
    sound.seek(time);
    set({
      currentTime: time,
      progress: ratio,
    });
  },

  // -------------------------------
  // Volume setter
  // -------------------------------
  setVolume: (v) => {
    const sound = get().howl;
    if (sound) sound.volume(v);
    set({ volume: v });
  },

  // -------------------------------
  // Fullscreen Toggle
  // -------------------------------
  isFullscreen: false,
  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),
}));
