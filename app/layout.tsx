import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Player } from "@/components/player/Player";

export const metadata = {
  title: "Beatshelf",
  description: "Music streaming app built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="flex h-screen overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-28 md:pb-24">
          {children}
        </main>

        <Player />
      </body>
    </html>
  );
}
