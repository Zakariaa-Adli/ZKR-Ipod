import { SelectableListOption } from "@/components/SelectableList";
import { DEFAULT_ARTWORK_URL } from "@/utils/constants/api";

/** Accepts a url with '{w}' and '{h}' and replaces them with the specified size */
export const getArtwork = (size: number | string, url?: string) => {
  if (!url) {
    return DEFAULT_ARTWORK_URL;
  }

  const urlWithSize = url.replace("{w}", `${size}`).replace("{h}", `${size}`);
  return urlWithSize;
};

/** Sets the document title based on the currently playing track. */
export const setDocumentSongTitle = (nowPlaying?: { name: string; artist: string }) => {
  if (nowPlaying) {
    document.title = `${nowPlaying.artist} – ${nowPlaying.name} – ZKR iPod`;
  } else {
    document.title = "ZKR iPod";
  }
};

/** Returns a list of playback options to display in a popup for a track. */
export const getMediaOptions = (
  type: "track" | "album" | "song" | "playlist",
  id: string
): SelectableListOption[] => {
  return [
    {
      type: "action",
      label: "Play Next",
      onSelect: () => {
        // Local music playback - play next track from catalog
      },
    },
    {
      type: "action",
      label: "Play Later",
      onSelect: () => {
        // Local music playback - add to queue
      },
    },
  ];
};

/** Formats playback time in minutes:seconds format. */
export const formatPlaybackTime = (seconds: number) => {
  const dateObject = new Date();
  dateObject.setMinutes(0);
  dateObject.setSeconds(seconds);
  const formattedMinutes = dateObject.getMinutes().toString().padStart(2, "0");
  const formattedSeconds = dateObject.getSeconds().toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Extracts the track ID from queue options.
 * Handles various queue option formats (song, songs array, album, playlist).
 */
export const getSongIdFromQueueOptions = (
  queueOptions: {
    song?: { id: string };
    songs?: { id: string }[];
    album?: { songs: { id: string }[] };
    playlist?: { songs: { id: string }[] };
  },
  startPosition = 0
): string | undefined => {
  return (
    queueOptions.song?.id ??
    queueOptions.songs?.[startPosition]?.id ??
    queueOptions.album?.songs[startPosition]?.id ??
    queueOptions.playlist?.songs[startPosition]?.id
  );
};