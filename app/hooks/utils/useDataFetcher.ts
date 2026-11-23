import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hooks";
import { tracks, Track } from "@public/songs/catalog";

const STALE_TIME = {
  library: 5 * 60 * 1000,
  detail: 10 * 60 * 1000,
  search: 60 * 1000,
} as const;

export const resolveAudioUrl = (src: string): string => {
  if (!src) return "";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  ) {
    return src;
  }
  if (src.startsWith("songs/")) {
    return `/${src}`;
  }
  return `/songs/${src}`;
};

export const resolveArtworkUrl = (cover?: string): string => {
  if (!cover) return "/default_album_artwork.png";
  if (
    cover.startsWith("http://") ||
    cover.startsWith("https://") ||
    cover.startsWith("/")
  ) {
    return cover;
  }
  if (cover.startsWith("songs/")) {
    return `/${cover}`;
  }
  return `/songs/${cover}`;
};

export const trackToSong = (t: Track, index = 0): MediaApi.Song => {
  const title = t.title || "Untitled Track";
  const artist = t.artist || "Unknown Artist";
  const album = t.album || "Unknown Album";
  const artworkUrl = resolveArtworkUrl(t.cover);

  return {
    id: t.id || `track-${index}`,
    name: title,
    artistName: artist,
    albumName: album,
    trackNumber: t.trackNumber ?? index + 1,
    duration: t.duration || 0,
    url: resolveAudioUrl(t.src),
    artwork: { url: artworkUrl },
  };
};

export const getLocalSongs = (): MediaApi.Song[] => {
  return tracks.map((t, idx) => trackToSong(t, idx));
};

export const getLocalAlbums = (): MediaApi.Album[] => {
  const albumMap = new Map<
    string,
    {
      albumName: string;
      artistName: string;
      artworkUrl: string;
      songs: MediaApi.Song[];
    }
  >();

  tracks.forEach((track, index) => {
    const song = trackToSong(track, index);
    const albumName = (track.album || "Unknown Album").trim();
    const albumKey = albumName.toLowerCase();

    if (!albumMap.has(albumKey)) {
      albumMap.set(albumKey, {
        albumName,
        artistName: track.artist || "Unknown Artist",
        artworkUrl: resolveArtworkUrl(track.cover),
        songs: [],
      });
    }

    const entry = albumMap.get(albumKey)!;
    if (!entry.artworkUrl || entry.artworkUrl === "/default_album_artwork.png") {
      entry.artworkUrl = resolveArtworkUrl(track.cover);
    }
    entry.songs.push(song);
  });

  return Array.from(albumMap.values()).map((data) => {
    const songs = [...data.songs].sort((a, b) => {
      const aTrack = a.trackNumber ?? Number.MAX_SAFE_INTEGER;
      const bTrack = b.trackNumber ?? Number.MAX_SAFE_INTEGER;
      if (aTrack !== bTrack) return aTrack - bTrack;
      return a.name.localeCompare(b.name);
    });

    return {
      id: encodeURIComponent(data.albumName.toLowerCase()),
      name: data.albumName,
      artistName: data.artistName,
      artwork: { url: data.artworkUrl },
      url: "",
      songs,
    };
  });
};

export const getLocalArtists = (): MediaApi.Artist[] => {
  const albums = getLocalAlbums();
  const artistMap = new Map<
    string,
    {
      artistName: string;
      artworkUrl?: string;
      albums: MediaApi.Album[];
    }
  >();

  albums.forEach((album) => {
    const artistKey = (album.artistName || "Unknown Artist").trim();
    if (!artistMap.has(artistKey)) {
      artistMap.set(artistKey, {
        artistName: artistKey,
        artworkUrl: album.artwork?.url,
        albums: [],
      });
    }
    artistMap.get(artistKey)!.albums.push(album);
  });

  return Array.from(artistMap.entries()).map(([key, data]) => ({
    id: encodeURIComponent(key.toLowerCase()),
    name: data.artistName,
    artwork: data.artworkUrl ? { url: data.artworkUrl } : undefined,
    url: "",
    albums: data.albums,
  }));
};

export const getLocalPlaylists = (): MediaApi.Playlist[] => {
  const songs = getLocalSongs();
  if (songs.length === 0) return [];

  return [
    {
      id: "all-songs",
      name: "All Songs",
      curatorName: "Local Library",
      description: `${songs.length} song${songs.length === 1 ? "" : "s"} in local library`,
      songs,
      url: "",
      artwork: songs[0]?.artwork,
    },
  ];
};

/** Data fetcher functions for local catalog */
export const fetchLocalAlbums = async (
  _params?: MediaApi.PaginationParams
): Promise<MediaApi.PaginatedResponse<MediaApi.Album[]>> => {
  const albums = getLocalAlbums();
  return {
    data: albums,
    nextPageParam: undefined,
  };
};

export const fetchLocalAlbum = async (
  id: string,
  _inLibrary?: boolean
): Promise<MediaApi.Album | undefined> => {
  const albums = getLocalAlbums();
  return albums.find(
    (a) => a.id === id || a.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
  );
};

export const fetchLocalArtists = async (
  _params?: MediaApi.PaginationParams
): Promise<MediaApi.PaginatedResponse<MediaApi.Artist[]>> => {
  const artists = getLocalArtists();
  return {
    data: artists,
    nextPageParam: undefined,
  };
};

export const fetchLocalArtistAlbums = async (
  id: string,
  _inLibrary?: boolean
): Promise<MediaApi.Album[]> => {
  const artists = getLocalArtists();
  const artist = artists.find(
    (a) => a.id === id || a.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
  );
  return artist?.albums ?? [];
};

export const fetchLocalPlaylists = async (
  _params?: MediaApi.PaginationParams
): Promise<MediaApi.PaginatedResponse<MediaApi.Playlist[]>> => {
  const playlists = getLocalPlaylists();
  return {
    data: playlists,
    nextPageParam: undefined,
  };
};

export const fetchLocalPlaylist = async (
  id: string,
  _inLibrary?: boolean
): Promise<MediaApi.Playlist | undefined> => {
  const playlists = getLocalPlaylists();
  return playlists.find((p) => p.id === id);
};

export const fetchLocalSearchResults = async (
  query: string
): Promise<MediaApi.SearchResults> => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { artists: [], albums: [], songs: [], playlists: [] };
  }

  const allSongs = getLocalSongs();
  const allAlbums = getLocalAlbums();
  const allArtists = getLocalArtists();
  const allPlaylists = getLocalPlaylists();

  return {
    songs: allSongs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.artistName?.toLowerCase().includes(q) ||
        s.albumName?.toLowerCase().includes(q)
    ),
    albums: allAlbums.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.artistName?.toLowerCase().includes(q)
    ),
    artists: allArtists.filter((art) => art.name.toLowerCase().includes(q)),
    playlists: allPlaylists.filter((p) => p.name.toLowerCase().includes(q)),
  };
};

export const useResolvedFetcher = () => {
  const { service, isAuthorized } = useSettings();

  const fetcher = {
    fetchAlbums: fetchLocalAlbums,
    fetchAlbum: fetchLocalAlbum,
    fetchArtists: fetchLocalArtists,
    fetchArtistAlbums: fetchLocalArtistAlbums,
    fetchPlaylists: fetchLocalPlaylists,
    fetchPlaylist: fetchLocalPlaylist,
    fetchSearchResults: fetchLocalSearchResults,
    fetchSongs: async () => getLocalSongs(),
  };

  return { fetcher, service, enabled: isAuthorized };
};

/** React Query hooks */
export const useFetchAlbum = (options: {
  id: string;
  inLibrary?: boolean;
  lazy?: boolean;
}) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useQuery({
    queryKey: ["local", "album", options.id],
    queryFn: () => fetcher.fetchAlbum(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchAlbums = (options?: {
  lazy?: boolean;
  artworkSize?: number;
}) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["local", "albums"],
    queryFn: ({ pageParam }) =>
      fetcher.fetchAlbums({ pageParam, limit: 50 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options?.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchArtists = (options?: { lazy?: boolean }) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["local", "artists"],
    queryFn: ({ pageParam }) =>
      fetcher.fetchArtists({ pageParam, limit: 50 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options?.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchArtistAlbums = (options: {
  id: string;
  inLibrary?: boolean;
  lazy?: boolean;
}) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useQuery({
    queryKey: ["local", "artistAlbums", options.id],
    queryFn: () => fetcher.fetchArtistAlbums(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchPlaylists = (options?: { lazy?: boolean }) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useInfiniteQuery({
    queryKey: ["local", "playlists"],
    queryFn: ({ pageParam }) =>
      fetcher.fetchPlaylists({ pageParam, limit: 50 }),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options?.lazy,
    getNextPageParam: (lastPage) => lastPage?.nextPageParam,
    initialPageParam: 0 as number | string,
  });
};

export const useFetchPlaylist = (options: {
  id: string;
  inLibrary?: boolean;
  lazy?: boolean;
}) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useQuery({
    queryKey: ["local", "playlist", options.id],
    queryFn: () => fetcher.fetchPlaylist(options.id, options.inLibrary),
    staleTime: STALE_TIME.detail,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchSearchResults = (options: {
  query: string;
  lazy?: boolean;
}) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useQuery({
    queryKey: ["local", "search", options.query],
    queryFn: () => fetcher.fetchSearchResults(options.query),
    staleTime: STALE_TIME.search,
    enabled: enabled && !options.lazy,
  });
};

export const useFetchSongs = (options?: { lazy?: boolean }) => {
  const { fetcher, enabled } = useResolvedFetcher();

  return useQuery({
    queryKey: ["local", "songs"],
    queryFn: () => fetcher.fetchSongs(),
    staleTime: STALE_TIME.library,
    enabled: enabled && !options?.lazy,
  });
};
