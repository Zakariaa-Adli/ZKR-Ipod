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
  icons: {
    icon: [
      {
        url: "/logo/zkr-icon-32.png?v=zkr1",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/logo/zkr-icon-16.png?v=zkr1",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo/zkr-icon-180.png?v=zkr1",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico?v=zkr1"],
  },
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
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/logo/zkr-icon-32.png?v=zkr1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo/zkr-icon-16.png?v=zkr1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo/zkr-icon-180.png?v=zkr1" />
        <link rel="shortcut icon" href="/favicon.ico?v=zkr1" />
        {!isProduction && (
          <script
            // Development only: a previously-installed production service
            // worker can keep serving stale chunks that reference deleted
            // assets. Unregister it and clear its caches once, then reload.
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  if (!("serviceWorker" in navigator)) return;

                  navigator.serviceWorker.getRegistrations().then(function (registrations) {
                    if (!registrations.length) return;

                    Promise.all(
                      registrations.map(function (registration) {
                        return registration.unregister();
                      })
                    ).then(function () {
                      var clearCaches =
                        "caches" in window
                          ? caches.keys().then(function (keys) {
                              return Promise.all(
                                keys.map(function (key) {
                                  return caches.delete(key);
                                })
                              );
                            })
                          : Promise.resolve();

                      clearCaches.then(function () {
                        try {
                          if (
                            sessionStorage.getItem("zkr-dev-sw-cleaned") === "1"
                          ) {
                            return;
                          }
                          sessionStorage.setItem("zkr-dev-sw-cleaned", "1");
                        } catch (error) {}

                        window.location.reload();
                      });
                    });
                  });
                })();
              `,
            }}
          />
        )}
      </head>
      <body>
        {isProduction ? (
          <SerwistProvider swUrl="/sw.js" options={{ scope: "/" }}>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </SerwistProvider>
        ) : (
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        )}
      </body>
    </html>
  );
}
