import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import NavbarContainer from '@/components/NavbarContainer';
import Footer from '@/components/Footer';

/** The production URL. Override with NEXT_PUBLIC_SITE_URL (e.g. https://devthread.com). */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://devthread.example';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'DevThread - Where engineers share what they\'s learned',
  description:
    'Practical threads from working engineers: backend, platform, and ML. No fluff, no hype — just hard-won knowledge you can apply today.',
  icons: {
    icon: '/devthread-icon.svg',
    shortcut: '/devthread-icon.svg',
    apple: '/devthread-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Variable Google Fonts loaded via standard stylesheet links.
            next/font/google is unavailable in this environment's Next.js
            build, so the fonts are wired up directly and the CSS custom
            properties below expose the same family names globals.css
            expects (--font-fraunces, --font-dm-sans, --font-jetbrains-mono). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,100..900&family=DM+Sans:opsz,wght@9..40,100..1000&family=JetBrains+Mono:opsz,wght@8..144,100..800&display=swap"
        />
      </head>
      <body>
        <NavbarContainer />
        <main className="min-h-screen pb-16">{children}</main>
        <Footer />
        {/* Google AdSense: loaded only when a publisher ID is configured.
            The client ID is public by design, so it comes from
            NEXT_PUBLIC_ADSENSE_CLIENT. Swap in your real ID before going live. */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}