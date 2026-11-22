import StyledComponentsRegistry from "@/lib/registry";
import { SerwistProvider } from "@/lib/serwist-provider";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ZKR iPod",
  description: "An iPod Classic built for the web — by ZKR.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZKR iPod",
  },
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/logo/zkr-icon-180.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/logo/zkr-icon-32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/logo/zkr-icon-16.png",
    },
    {
      rel: "shortcut icon",
      url: "/favicon.ico",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SerwistProvider swUrl="/sw.js" options={{ scope: "/" }}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </SerwistProvider>
      </body>
    </html>
  );
}
