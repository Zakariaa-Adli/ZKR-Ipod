export const APP_URL = "";
export const API_URL = `${APP_URL}/api`;

/**
 * Default artwork URL when no artwork is available for a track or album.
 */
export const DEFAULT_ARTWORK_URL = "/default_album_artwork.png";

/**
 * Key used to store the selected service in localStorage.
 * Values: "local" (for local music playback)
 */
export const SELECTED_SERVICE_KEY = "ipodJsSelectedService";

/**
 * Registers tracks from the local music library in public/songs/.
 * This function is called during application initialization.
 * Tracks are defined in public/songs/catalog.ts.
 */
export const registerLocalTracks = () => {
  return;
};
