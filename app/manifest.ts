import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZKR iPod",
    short_name: "ZKR iPod",
    description: "An iPod Classic built for the web — by ZKR.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#000000",
    background_color: "#000000",
    icons: [
      {
        src: "/logo/zkr-icon-48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/zkr-icon-72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/zkr-icon-96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/zkr-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/zkr-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
