# ZKR iPod

**ZKR iPod** is an iPod Classic–inspired music player built for the web. It recreates the familiar click-wheel experience with a modern Next.js stack, including music browsing, playback, Cover Flow, and a built-in default music library.

**Product:** ZKR iPod  
**Brand:** ZKR  
**Attribution:** Designed & developed by ZKR

## Features

- **iPod Classic–inspired interface** — A retro iPod-style UI with screen, click wheel, and classic navigation patterns.
- **Click Wheel navigation** — Browse menus and control playback using the on-screen wheel interactions and keyboard support.
- **Default music library** — Ships with a built-in local music catalog that loads automatically in the Music section.
- **Music playback controls** — Play, pause, next, previous, seek, and volume controls.
- **Library views** — Browse by **Songs**, **Albums**, **Artists**, and **Playlists**.
- **Cover Flow** — Browse albums visually with album artwork.
- **Now Playing** — View current track metadata, artwork, and playback progress.
- **Themes** — Includes **Silver**, **Black**, and **U2** device themes.
- **Responsive design** — Adapts to different screen sizes for desktop and mobile use.
- **PWA/service worker support** — Includes Serwist-based service worker build integration.

## Technology Stack

Built with the technologies defined in `package.json`:

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 7
- [styled-components](https://styled-components.com/) 6
- [Motion](https://motion.dev/) for animations
- [TanStack React Query](https://tanstack.com/query/latest) for data fetching/caching
- [Serwist](https://serwist.pages.dev/) for service worker generation
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality

## Default Music Library

The music system supports a default local library served as static public assets.

- **Audio files:** `public/songs/music/`
- **Album artwork:** `public/songs/artwork/`
- **Catalog source:** `public/songs/catalog.ts`

### How it works

- Tracks are registered in `public/songs/catalog.ts` as the default catalog.
- The app loads catalog data through `app/hooks/utils/useDataFetcher.ts` and plays tracks through `app/hooks/audio/useAudioPlayer.tsx`.
- Audio and artwork are referenced by stable public paths, for example:
  - `/songs/music/91%27s.m4a`
  - `/songs/artwork/13aecef23a1f292a.jpg`
- The same catalog is used by Music views (Songs, Albums, Artists, Playlists/Search), Cover Flow, and Now Playing.

### Public repository note

The third-party audio and album artwork files used in the local development version are **intentionally excluded** from this public repository pending explicit public redistribution permission. The catalog, playback architecture, and local files are preserved in the development workspace; only the media assets are excluded from public publication.

### Adding or updating tracks

1. Add audio files to `public/songs/music/`.
2. Add or update artwork in `public/songs/artwork/` (if needed).
3. Register/update track entries in `public/songs/catalog.ts` with accurate metadata:
   - `id`, `title`, `artist`, `album`, `src`, `cover`, `duration`, and optional `trackNumber` / `year`.
4. Keep filenames and public paths stable.
5. Run the app/build checks and verify playback, metadata, and artwork.

> **Note:** Before publishing or deploying audio files publicly, ensure you have the necessary rights or permission to distribute them.

## Installation and Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)

### Setup (Windows-friendly)

```bash
git clone https://github.com/Zakariaa-Adli/ZKR-Ipod.git
cd ZKR-Ipod
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev         # Start the Next.js development server
npm run build       # Create a production build and generate the service worker
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript checks (tsc --noEmit)
```

## Production Build

Create and verify a production build locally:

```bash
npm run build
npx next start -p 3000
```

Then open [http://localhost:3000](http://localhost:3000) and verify the Music library, playback, Cover Flow, and Now Playing.

## Vercel Deployment

1. Push the repository to GitHub.
2. In [Vercel](https://vercel.com/), create/import a project from `Zakariaa-Adli/ZKR-Ipod`.
3. Use the **Next.js** framework preset.
4. Configure build settings:
   - **Install command:** `npm install` (or your preferred package manager)
   - **Build command:** `npm run build`
   - **Output:** default Next.js output
5. Deploy.

To deploy the full default music library publicly, the audio files in `public/songs/music/` and artwork in `public/songs/artwork/` must be present in the deployment **and** you must have explicit permission to redistribute them publicly. In this public repository, those third-party media files are currently excluded pending explicit redistribution permission. The application source, catalog, and playback architecture are published; local media assets remain preserved in the development workspace.

## Project Structure

```text
.
├── app/                    # Next.js app, components, hooks, providers, utils
│   ├── components/         # UI components, views, Cover Flow, Now Playing, controls
│   ├── hooks/              # Audio, navigation, and data hooks
│   └── utils/              # Shared utilities
├── public/
│   ├── songs/
│   │   ├── music/          # Default audio files (static assets)
│   │   ├── artwork/        # Extracted/local album artwork
│   │   └── catalog.ts      # Default music catalog/metadata
│   └── ...                 # Icons, manifest, static assets
├── serwist.config.js       # Serwist/service worker build config
├── next.config.mjs         # Next.js configuration
├── package.json            # Scripts and dependencies
└── README.md
```

## Credits

**ZKR iPod**  
Designed & developed by ZKR.
