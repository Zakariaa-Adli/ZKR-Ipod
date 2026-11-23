"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useEventListener, useHapticFeedback } from "@/hooks";
import { IpodEvent } from "@/utils/events";
import { getLocalSongs } from "@/hooks/utils/useDataFetcher";

export const defaultPlaybackInfoState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  timeRemaining: 0,
  percent: 0,
  duration: 0,
};

export interface MediaItem {
  id: string;
  name: string;
  artist: string;
  album: string;
  artwork?: string | { url: string };
  duration?: number;
  url: string;
}

export interface AudioPlayerState {
  playbackInfo: typeof defaultPlaybackInfoState;
  nowPlayingItem?: MediaItem;
  volume: number;
  shuffleMode: "off" | "songs" | "albums";
  repeatMode: "off" | "one" | "all";
  play: (
    target: MediaApi.QueueOptions | string,
    trackUrl?: string
  ) => Promise<void>;
  pause: () => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrevious: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekToTime: (seconds: number) => Promise<void>;
  setVolume: (volume: number) => void;
  setShuffleMode: (mode: "off" | "songs" | "albums") => Promise<void>;
  setRepeatMode: (mode: "off" | "one" | "all") => Promise<void>;
  updateNowPlayingItem: () => Promise<void>;
  updatePlaybackInfo: () => Promise<void>;
  reset: () => void;
}

export const AudioPlayerContext = createContext<AudioPlayerState>(
  {} as AudioPlayerState
);

export const useAudioPlayer = (): AudioPlayerState => {
  return useContext(AudioPlayerContext);
};

interface Props {
  children: React.ReactNode;
}

export const AudioPlayerProvider = ({ children }: Props) => {
  const [playbackInfo, setPlaybackInfo] = useState(defaultPlaybackInfoState);
  const [nowPlayingItem, setNowPlayingItem] = useState<MediaItem>();
  const [volume, setVolumeState] = useState(0.5);
  const [shuffleMode, setShuffleModeState] = useState<
    "off" | "songs" | "albums"
  >("off");
  const [repeatMode, setRepeatModeState] = useState<"off" | "one" | "all">(
    "off"
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<MediaApi.Song[]>([]);
  const queueIndexRef = useRef<number>(0);
  const repeatModeRef = useRef(repeatMode);
  const shuffleModeRef = useRef(shuffleMode);

  repeatModeRef.current = repeatMode;
  shuffleModeRef.current = shuffleMode;

  const { triggerHaptics } = useHapticFeedback();

  // Load saved volume from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedVolume = localStorage.getItem("ipodVolume");
    const vol = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
    const clampedVol = isNaN(vol) ? 0.5 : Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVol);

    const savedShuffle = localStorage.getItem("ipodShuffleMode") as
      | "off"
      | "songs"
      | "albums"
      | null;
    if (savedShuffle) setShuffleModeState(savedShuffle);

    const savedRepeat = localStorage.getItem("ipodRepeatMode") as
      | "off"
      | "one"
      | "all"
      | null;
    if (savedRepeat) setRepeatModeState(savedRepeat);
  }, []);

  const playSong = useCallback(
    async (song: MediaApi.Song) => {
      if (!audioRef.current || typeof window === "undefined") return;

      const audio = audioRef.current;
      const artworkUrl =
        typeof song.artwork === "string"
          ? song.artwork
          : song.artwork?.url || "/default_album_artwork.png";

      setNowPlayingItem({
        id: song.id,
        name: song.name,
        artist: song.artistName || "Unknown Artist",
        album: song.albumName || "Unknown Album",
        artwork: artworkUrl,
        duration: song.duration,
        url: song.url,
      });

      if (!song.url) {
        setPlaybackInfo({
          ...defaultPlaybackInfoState,
          isPaused: true,
        });
        return;
      }

      setPlaybackInfo((prev) => ({
        ...prev,
        isLoading: true,
        isPlaying: false,
        isPaused: false,
      }));

      try {
        if (audio.src !== song.url && !audio.src.endsWith(song.url)) {
          audio.pause();
          audio.src = song.url;
          audio.load();
        }

        await audio.play();
        triggerHaptics();
      } catch (err) {
        setPlaybackInfo((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          isPaused: true,
        }));
      }
    },
    [triggerHaptics]
  );

  const skipNext = useCallback(async () => {
    triggerHaptics();
    const queue = queueRef.current;
    if (queue.length === 0) return;

    let nextIndex = queueIndexRef.current + 1;
    if (nextIndex >= queue.length) {
      if (repeatModeRef.current === "all") {
        nextIndex = 0;
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setPlaybackInfo((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: true,
          currentTime: 0,
        }));
        return;
      }
    }

    queueIndexRef.current = nextIndex;
    const nextSong = queue[nextIndex];
    if (nextSong) {
      await playSong(nextSong);
    }
  }, [playSong, triggerHaptics]);

  const skipPrevious = useCallback(async () => {
    triggerHaptics();
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setPlaybackInfo((prev) => ({ ...prev, currentTime: 0, percent: 0 }));
      return;
    }

    const queue = queueRef.current;
    if (queue.length === 0) return;

    let prevIndex = queueIndexRef.current - 1;
    if (prevIndex < 0) {
      if (repeatModeRef.current === "all") {
        prevIndex = queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    queueIndexRef.current = prevIndex;
    const prevSong = queue[prevIndex];
    if (prevSong) {
      await playSong(prevSong);
    }
  }, [playSong, triggerHaptics]);

  // Initialize Audio element and attach listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const onTimeUpdate = () => {
      const dur = audio.duration;
      const cur = audio.currentTime;
      if (dur && !isNaN(dur)) {
        const percent = (cur / dur) * 100;
        setPlaybackInfo({
          isPlaying: !audio.paused,
          isPaused: audio.paused,
          isLoading: false,
          currentTime: cur,
          timeRemaining: Math.max(0, dur - cur),
          percent: Math.round(percent),
          duration: dur,
        });
      } else {
        setPlaybackInfo((prev) => ({
          ...prev,
          currentTime: cur,
          isPlaying: !audio.paused,
          isPaused: audio.paused,
        }));
      }
    };

    const onPlay = () => {
      setPlaybackInfo((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isLoading: false,
      }));
    };

    const onPause = () => {
      setPlaybackInfo((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
      }));
    };

    const onCanPlay = () => {
      setPlaybackInfo((prev) => ({
        ...prev,
        isLoading: false,
        duration: isNaN(audio.duration) ? prev.duration : audio.duration,
      }));
    };

    const onEnded = () => {
      if (repeatModeRef.current === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        skipNext();
      }
    };

    const onError = () => {
      setPlaybackInfo((prev) => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        isPaused: true,
      }));
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  }, [skipNext, volume]);

  const play = useCallback(
    async (
      target: MediaApi.QueueOptions | string,
      trackUrl?: string
    ): Promise<void> => {
      let songToPlay: MediaApi.Song | undefined;
      let newQueue: MediaApi.Song[] = [];
      let startIndex = 0;

      if (typeof target === "string") {
        const url = trackUrl || target;
        songToPlay = {
          id: target,
          name: target.split("/").pop() || target,
          artistName: "Unknown Artist",
          albumName: "Unknown Album",
          trackNumber: 1,
          duration: 0,
          url,
          artwork: { url: "/default_album_artwork.png" },
        };
        newQueue = [songToPlay];
        startIndex = 0;
      } else if (typeof target === "object" && target !== null) {
        if (target.song) {
          songToPlay = target.song;
          newQueue =
            target.songs && target.songs.length > 0
              ? target.songs
              : [target.song];
          startIndex = newQueue.findIndex((s) => s.id === target.song!.id);
          if (startIndex === -1) startIndex = 0;
        } else if (target.album?.songs && target.album.songs.length > 0) {
          newQueue = target.album.songs;
          startIndex = target.startPosition ?? 0;
          songToPlay = newQueue[startIndex] ?? newQueue[0];
        } else if (target.playlist?.songs && target.playlist.songs.length > 0) {
          newQueue = target.playlist.songs;
          startIndex = target.startPosition ?? 0;
          songToPlay = newQueue[startIndex] ?? newQueue[0];
        } else if (target.songs && target.songs.length > 0) {
          newQueue = target.songs;
          startIndex = target.startPosition ?? 0;
          songToPlay = newQueue[startIndex] ?? newQueue[0];
        }
      }

      if (songToPlay) {
        queueRef.current = newQueue;
        queueIndexRef.current = startIndex;
        await playSong(songToPlay);
      }
    },
    [playSong]
  );

  const pause = useCallback(async () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    triggerHaptics();
    const audio = audioRef.current;
    if (!audio) return;

    if (!nowPlayingItem) {
      const allSongs = getLocalSongs();
      if (allSongs.length > 0) {
        queueRef.current = allSongs;
        queueIndexRef.current = 0;
        await playSong(allSongs[0]);
      }
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaybackInfo((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          isPaused: true,
        }));
      }
    } else {
      audio.pause();
    }
  }, [nowPlayingItem, playSong, triggerHaptics]);

  const seekToTime = useCallback(async (seconds: number) => {
    const audio = audioRef.current;
    if (audio && !isNaN(seconds)) {
      const clamped = Math.max(0, Math.min(audio.duration || seconds, seconds));
      audio.currentTime = clamped;
      setPlaybackInfo((prev) => ({
        ...prev,
        currentTime: clamped,
        timeRemaining: Math.max(0, (prev.duration || 0) - clamped),
        percent:
          prev.duration > 0 ? Math.round((clamped / prev.duration) * 100) : 0,
      }));
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("ipodVolume", `${clamped}`);
    }
  }, []);

  const setShuffleMode = useCallback(
    async (mode: "off" | "songs" | "albums") => {
      setShuffleModeState(mode);
      if (typeof window !== "undefined") {
        localStorage.setItem("ipodShuffleMode", mode);
      }
    },
    []
  );

  const setRepeatMode = useCallback(
    async (mode: "off" | "one" | "all") => {
      setRepeatModeState(mode);
      if (typeof window !== "undefined") {
        localStorage.setItem("ipodRepeatMode", mode);
      }
    },
    []
  );

  const updateNowPlayingItem = useCallback(async () => {}, []);

  const updatePlaybackInfo = useCallback(async () => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      setPlaybackInfo({
        isPlaying: !audio.paused,
        isPaused: audio.paused,
        isLoading: false,
        currentTime: audio.currentTime,
        timeRemaining: Math.max(0, audio.duration - audio.currentTime),
        percent: Math.round(percent),
        duration: audio.duration,
      });
    }
  }, []);

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setNowPlayingItem(undefined);
    setPlaybackInfo(defaultPlaybackInfoState);
    queueRef.current = [];
    queueIndexRef.current = 0;
  }, []);

  // Listen for iPod wheel events
  useEventListener<IpodEvent>("playpauseclick", () => {
    togglePlayPause();
  });

  useEventListener<IpodEvent>("forwardclick", () => {
    skipNext();
  });

  useEventListener<IpodEvent>("backwardclick", () => {
    skipPrevious();
  });

  return (
    <AudioPlayerContext.Provider
      value={{
        playbackInfo,
        nowPlayingItem,
        volume,
        shuffleMode,
        repeatMode,
        play,
        pause,
        skipNext,
        skipPrevious,
        togglePlayPause,
        seekToTime,
        setVolume,
        setShuffleMode,
        setRepeatMode,
        updateNowPlayingItem,
        updatePlaybackInfo,
        reset,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default useAudioPlayer;
