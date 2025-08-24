import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Visual Edge',
  description: 'Crafting Visions, Creating Worlds. A modern media production company.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro&family=DM+Serif+Text:wght@400;700&family=Poppins:wght@700&family=Roboto:wght@400&family=Inter:wght@400;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
