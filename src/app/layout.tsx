
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Mitar Media',
  description: 'Crafting Visions, Creating Worlds. A modern media production company specializing in video marketing, social media content, and corporate presentations.',
  keywords: ['Mitar Media', 'producție video', 'video marketing', 'content social media', 'prezentări companie', 'video producție', 'filmare evenimente'],
  authors: [{ name: 'Mitar Media', url: 'https://mitarmedia.ro' }],
  creator: 'Mitar Media',
  publisher: 'Mitar Media',
  metadataBase: new URL('https://mitarmedia.ro'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mitar Media - Crafting Visions, Creating Worlds',
    description: 'Complete video production solutions, from concept to final product. We create marketing videos, social media content, and corporate presentations.',
    url: 'https://mitarmedia.ro',
    siteName: 'Mitar Media',
    images: [
      {
        url: '/og-image.png', // Trebuie să existe o imagine `og-image.png` în folderul `public`
        width: 1200,
        height: 630,
        alt: 'Mitar Media - Video Production',
      },
    ],
    locale: 'ro_RO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitar Media - Video Production',
    description: 'We craft compelling visual stories. From marketing videos to corporate presentations, we bring your vision to life.',
    creator: '@MitarMedia',
    images: ['/og-image.png'], // Trebuie să existe o imagine `og-image.png` în folderul `public`
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/site.webmanifest', // Trebuie creat acest fișier în folderul `public`
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro&family=DM+Serif+Text:wght@400;700&family=Poppins:wght@700&family=Roboto:wght@400&family=Inter:wght@400;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
