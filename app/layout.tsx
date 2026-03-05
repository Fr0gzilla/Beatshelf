import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
