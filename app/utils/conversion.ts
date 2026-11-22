import { decode as decodeHtmlEntities } from "he";

// Artwork Conversion

/** Accepts a url with '{w}' and '{h}' and replaces them with the specified size */
export const getAppleArtwork = (size: number | string, url?: string) => {
  if (!url) {
    return undefined;
  }

  return url.replace("{w}", `${size || 100}`).replace("{h}", `${size || 100}`);
};

/** Default artwork URL when no artwork is available */
export const DEFAULT_ARTWORK_URL = "/assets/default-album-artwork.png";

/** Get artwork URL, returning default if none available */
export const getArtwork = (size: number | string, url?: string) => {
  if (!url) {
    return DEFAULT_ARTWORK_URL;
  }

  const urlWithSize = url.replace("{w}", `${size}`).replace("{h}", `${size}`);
  return urlWithSize;
};

/** Media item type for local playback */
export type MediaItem = {
  id: string;
  name: string;
  url: string;
  artwork?: string;
  artist?: string;
  album?: string;
  duration?: number;
};

/** Register tracks from the local music library */
export const registerTracks = (tracks: MediaItem[]) => {
  // Track catalog is populated externally
  // This function is called from the library initialization
};

/** Format playback time */
export const formatPlaybackTime = (seconds: number) => {
  const dateObject = new Date();
  dateObject.setMinutes(0);
  dateObject.setSeconds(seconds);
  const formattedMinutes = dateObject.getMinutes().toString().padStart(2, "0");
  const formattedSeconds = dateObject.getSeconds().toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};