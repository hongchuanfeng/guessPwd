import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from '@/context/LocaleContext';
import { GameProvider } from '@/context/GameContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://guess.zorezoro.com'),
  title: {
    default: 'Password Cracker - Crack the Code',
    template: '%s | Password Cracker',
  },
  description: 'A cyberpunk-themed password guessing game with 10 difficulty levels. Challenge your logical reasoning and deduction skills!',
  keywords: ['password game', 'code cracker', 'logic puzzle', 'number guessing', 'cyberpunk', 'brain game', 'puzzle game', '猜密码', '密码破解', '益智游戏'],
  authors: [{ name: 'ZoreZoro' }],
  creator: 'ZoreZoro',
  publisher: 'ZoreZoro',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Password Cracker - Crack the Code',
    description: 'A cyberpunk-themed password guessing game with 10 difficulty levels.',
    site: '@zorezoro',
    creator: '@zorezoro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Password Cracker Game',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    url: 'https://guess.zorezoro.com',
    siteName: 'Password Cracker',
    title: 'Password Cracker - Crack the Code',
    description: 'A cyberpunk-themed password guessing game with 10 difficulty levels. Challenge your logical reasoning and deduction skills!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Password Cracker Game',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7274710287377352" crossOrigin="anonymous"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B8E8SVW9WK"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-B8E8SVW9WK');`,
          }}
        />
      </head>
      <body className="grid-bg">
        <LocaleProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
