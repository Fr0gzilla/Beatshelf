import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Beatshelf",
    template: "%s | Beatshelf",
  },
  description: "Your personal beat sanctuary. Discover, stream and organize your favorite music.",
  keywords: ["music", "streaming", "beatshelf", "player", "deezer", "playlists"],
  openGraph: {
    title: "Beatshelf",
    description: "Your personal beat sanctuary. Discover, stream and organize your favorite music.",
    type: "website",
    locale: "fr_FR",
    siteName: "Beatshelf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beatshelf",
    description: "Your personal beat sanctuary.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
