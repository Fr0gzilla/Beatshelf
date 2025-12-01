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
      <body className="bg-zinc-900 text-white flex">
        <Sidebar />

        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>

        <Player />
      </body>
    </html>
  );
}
