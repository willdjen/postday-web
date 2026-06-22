import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import Providers from '@/components/providers';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Postday',
    template: '%s | Postday',
  },
  description: 'Platform manajemen media sosial berbasis AI untuk UMKM, agensi, dan kreator Indonesia.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
