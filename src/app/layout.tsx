import type { Metadata, Viewport } from "next"; // Adicionei 'Viewport' aqui
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/contexts/PlayerContext";
import MusicPlayer from "@/components/MusicPlayer";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. A NOVA exportação separada para Viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
};

// 2. A exportação Metadata (sem o bloco viewport dentro)
export const metadata: Metadata = {
  title: {
    default: "MyMusicFy - Sua música sem limites",
    template: "%s | MyMusicFy"
  },
  description: "O MyMusicFy conecta você ao melhor do áudio com capas oficiais. Organize, descubra e reproduza as suas faixas favoritas num único lugar.",
  keywords: ["música", "playlist", "streaming", "áudio", "MyMusicFy", "música online", "playlist personalizada"],
  authors: [{ name: "MyMusicFy Team" }],
  creator: "MyMusicFy",
  publisher: "MyMusicFy",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "MyMusicFy",
    title: "MyMusicFy - Sua música sem limites",
    description: "Organize, descubra e reproduza as suas faixas favoritas num único lugar.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MyMusicFy - Sua música sem limites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyMusicFy - Sua música sem limites",
    description: "Organize, descubra e reproduza as suas faixas favoritas.",
    images: ["/og-image.png"],
    creator: "@MyMusicFy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <PlayerProvider> 
            {children}
            <MusicPlayer />
          </PlayerProvider>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'rgb(17 24 39)',
                border: '1px solid rgb(55 65 81)',
                color: '#fff',
              },
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}