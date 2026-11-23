// @ts-check
import { serwist } from "@serwist/next/config";

export default serwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Keep default music files out of the precache manifest; they are large and should be fetched on demand.
  globIgnores: ["public/songs/music/**"],
});
