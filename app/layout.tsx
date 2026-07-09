import type { Metadata } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Lilian Guo — Portraits, Streets, Travel",
  description:
    "Photography portfolio of Lilian Guo — portrait, street, and travel work, including an ongoing documentary project on mental health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        {/* Placeholder photos are served from picsum.photos, which redirects to
            its Fastly CDN host — preconnect to both to cut connection setup
            time off the first (uncached) image request. Remove once real,
            self-hosted photos replace the picsum placeholders. */}
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="preconnect" href="https://fastly.picsum.photos" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
