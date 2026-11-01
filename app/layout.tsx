import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Dancing_Script } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sanskarphougat.dev'),
  title: 'Sanskar Phougat — Software Engineer',
  description:
    'Software engineer building secure, tested and deployed backend systems. Final-year B.Tech ECE at JIIT Noida.',
  openGraph: {
    title: 'Sanskar Phougat — Software Engineer',
    description:
      'Software engineer building secure, tested and deployed backend systems. Final-year B.Tech ECE at JIIT Noida.',
    images: [{ url: '/avatar.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/avatar.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${dancingScript.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
