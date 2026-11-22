/**
 * ZKR iPod Local Music Catalog
 * 
 * This catalog is automatically populated when tracks are added to public/songs/.
 * New tracks can be registered by importing this module and extending the array.
 * 
 * Format:
 * - MP3, WAV, OGG, and M4A formats are supported
 * - Artwork is optional; if absent, a default album cover is used
 * - Duration may be null if unknown
 */

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string; // Path relative to public/songs/
  cover?: string; // Path to album artwork
  duration?: number; // in seconds, or null if unknown
};

// Default empty catalog - tracks are added by the user via the catalog import
export const tracks: Track[] = [];

/**
 * Register additional tracks to the catalog.
 * This function merges new tracks with the existing catalog.
 */
export const registerTracks = (newTracks: Track[]): Track[] => {
  // Avoid duplicates by ID
  const existingIds = new Set(tracks.map((t) => t.id));
  const merged = [...tracks, ...newTracks.filter((t) => !existingIds.has(t.id))];
  return merged;
};