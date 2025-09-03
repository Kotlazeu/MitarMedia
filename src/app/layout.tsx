
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';
import { LanguageProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'Mitar Media',
  description: 'Crafting Visions, Creating Worlds. A modern media production company.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  }
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
        <LanguageProvider>
            {children}
            <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
