/**
 * Local Music Types for ZKR iPod
 * 
 * These types replace the Apple Music / Spotify type definitions.
 * Track data is sourced from the public/songs/ directory catalog.
 */

export type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  src: string; // Path relative to public/songs/
  cover?: string; // Path to album artwork
  duration?: number; // in seconds, or null if unknown
};

export type MediaItem = Track & {
  playlistArtworkUrl?: string;
  playlistName?: string;
  previewUrl?: string;
};

export type QueueOptions = {
  album?: { id: string; songs: Track[] };
  playlist?: { id: string; songs: Track[] };
  songs?: Track[];
  song?: Track;
  startPosition?: number;
};

export type SearchResults = {
  artists: Track[];
  albums: Track[];
  songs: Track[];
  playlists: Track[];
};

export type PaginationParams = {
  pageParam: number | string;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  nextPageParam?: number | string;
};