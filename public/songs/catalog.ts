/**
 * ZKR iPod Local Music Catalog
 *
 * Default tracks are served from public/songs/music and registered here so
 * they are available automatically in the Music library.
 */

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string; // Public path, e.g. /songs/music/file.mp3
  cover?: string; // Public path to album artwork
  duration?: number; // seconds
  trackNumber?: number;
  year?: number;
  genre?: string;
};

// Default built-in library. Keep IDs stable to avoid duplicate registration.
export const tracks: Track[] = [
  {
    id: "default-91s-pnl-deux-freres",
    title: "91's",
    artist: "PNL",
    album: "Deux Frères",
    src: "/songs/music/91%27s.m4a",
    cover: "/songs/artwork/13aecef23a1f292a.jpg",
    duration: 237.15,
    trackNumber: 5,
    year: 2019,
  },
  {
    id: "default-7essan-mobydick-lmadda-lkham",
    title: "7ESSAN",
    artist: "Mobydick // الموتشو",
    album: "Lmadda Lkham",
    src: "/songs/music/7ESSAN.m4a",
    cover: "/songs/artwork/dc97101170844b38.jpg",
    duration: 285.89,
    year: 2015,
  },
  {
    id: "default-a-rose-blooms-in-chaos-davishmar",
    title: "a rose blooms in chaos",
    artist: "Davishmar",
    album: "a rose blooms in chaos",
    src: "/songs/music/a%20rose%20blooms%20in%20chaos.m4a",
    cover: "/songs/artwork/2148036c26bf8428.jpg",
    duration: 116.85,
    year: 2024,
  },
  {
    id: "default-aghla-min-omry-amr-diab-banadek-taala",
    title: "Aghla Min Omry",
    artist: "Amr Diab",
    album: "Banadek Taala",
    src: "/songs/music/Aghla%20Min%20Omry%20-%20Amr%20Diab.m4a",
    cover: "/songs/artwork/e8fa634a00fc5b67.jpg",
    duration: 285.87,
    year: 2021,
  },
  {
    id: "default-alive-kasbo-alive",
    title: "Alive",
    artist: "Kasbo",
    album: "Alive",
    src: "/songs/music/Alive%20-%20Kasbo.m4a",
    cover: "/songs/artwork/292cfdfd7c77f081.jpg",
    duration: 280.65,
    year: 2023,
  },
  {
    id: "default-allumak-leh-amr-diab-banadek-taala",
    title: "Allumak Leh",
    artist: "Amr Diab",
    album: "Banadek Taala",
    src: "/songs/music/Allumak%20Leh%20-%20Amr%20Diab.m4a",
    cover: "/songs/artwork/e8fa634a00fc5b67.jpg",
    duration: 200.77,
    year: 2021,
  },
  {
    id: "default-ally-el-wadaa-amr-diab-allem-alby",
    title: "Ally El Wadaa",
    artist: "Amr Diab",
    album: "Allem Alby",
    src: "/songs/music/Ally%20El%20Wadaa.m4a",
    cover: "/songs/artwork/cbc5fe997b95f37f.jpg",
    duration: 194.05,
    year: 2014,
  },
  {
    id: "default-amargura-karol-g-manana-sera-bonito",
    title: "AMARGURA",
    artist: "KAROL G",
    album: "MAÑANA SERÁ BONITO",
    src: "/songs/music/AMARGURA%20-%20KAROL%20G.m4a",
    cover: "/songs/artwork/9bde9049de3a1c5e.jpg",
    duration: 170.53,
    year: 2023,
  },
  {
    id: "default-amazing-play-and-win-club-version-inna",
    title: "Amazing (Play & Win Club Version)",
    artist: "INNA",
    album: "Amazing (Play & Win Club Version)",
    src: "/songs/music/Amazing%20(Play%20%26%20Win%20Club%20Version).m4a",
    cover: "/songs/artwork/f56261c5b1f8b8cf.jpg",
    duration: 210.01,
    year: 2024,
  },
  {
    id: "default-antenna-bonobo-the-north-borders",
    title: "Antenna",
    artist: "Bonobo",
    album: "The North Borders",
    src: "/songs/music/Antenna.m4a",
    cover: "/songs/artwork/d64520366d4df390.jpg",
    duration: 212.39,
    year: 2013,
  },
  {
    id: "default-ashes-saib-escapade",
    title: "Ashes",
    artist: "saib.",
    album: "Escapade",
    src: "/songs/music/Ashes.m4a",
    cover: "/songs/artwork/f606b0b4730f9352.jpg",
    duration: 204.06,
    year: 2019,
  },
  {
    id: "default-babor-naar-shayfeen-hornet-la-frappe-safar",
    title: "Babor (with Shayfeen, Hornet La Frappe)",
    artist: "Naar, Shayfeen, Hornet la Frappe",
    album: "Safar",
    src: "/songs/music/Babor%20(with%20Shayfeen%2C%20Hornet%20La%20Frappe).m4a",
    cover: "/songs/artwork/20d123769d9985e0.jpg",
    duration: 236.58,
    year: 2020,
  },
  {
    id: "default-bad-boys-inna-inna",
    title: "Bad Boys",
    artist: "INNA",
    album: "INNA",
    src: "/songs/music/Bad%20Boys.m4a",
    cover: "/songs/artwork/1c698e8f10916572.jpg",
    duration: 166.79,
    trackNumber: 3,
    year: 2015,
  },
  {
    id: "default-baedt-leh-amr-diab-wayah",
    title: "Baedt Leh",
    artist: "Amr Diab",
    album: "Wayah",
    src: "/songs/music/Baedt%20Leh.m4a",
    cover: "/songs/artwork/e3ff16800ce6e950.jpg",
    duration: 251.62,
    year: 2022,
  },
  {
    id: "default-baida-naar-malca-kaydy-cain-madd-safar",
    title: "Baida (with Malca, Kaydy Cain, Madd)",
    artist: "Naar, Madd, Kaydy Cain, Malca",
    album: "Safar",
    src: "/songs/music/Baida%20(with%20Malca%2C%20Kaydy%20Cain%2C%20Madd).m4a",
    cover: "/songs/artwork/20d123769d9985e0.jpg",
    duration: 198.26,
    year: 2020,
  },
  {
    id: "default-bghit-smallx-saib-nafida",
    title: "BGHIT",
    artist: "Smallx & Saib",
    album: "NAFIDA",
    src: "/songs/music/BGHIT.mp3",
    cover: "/songs/artwork/31ae9e465c8f0df8.jpg",
    duration: 213.71,
    trackNumber: 2,
    year: 2025,
  },
];

/**
 * Register additional tracks into the catalog. Deduplicates by track id.
 * Returns the current catalog contents after merge.
 */
export const registerTracks = (newTracks: Track[]): Track[] => {
  const existingIds = new Set(tracks.map((t) => t.id));
  for (const track of newTracks) {
    if (!existingIds.has(track.id)) {
      tracks.push(track);
      existingIds.add(track.id);
    }
  }
  return tracks;
};
