import { Metadata } from "next";
import Cart from "@/layouts/components/cart/Cart";
import OpenCart from "@/layouts/components/cart/OpenCart";
import config from "@/config/config.json";
import theme from "@/config/theme.json";
import TwSizeIndicator from "@/helpers/TwSizeIndicator";
import Footer from "@/layouts/partials/Footer";
import Header from "@/layouts/partials/Header";
import Providers from "@/layouts/partials/Providers";
import "@/styles/main.scss";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(config.site.base_url.startsWith('http') ? config.site.base_url : `https://${config.site.base_url}`),
  title: {
    default: config.site.title,
    template: `%s | ${config.site.title}`,
  },
  description: config.metadata?.meta_description || config.site.title,
  keywords: config.metadata?.meta_keywords || [config.site.title],
  authors: [{ name: config.metadata?.meta_author || config.site.title }],
  creator: config.metadata?.meta_author || config.site.title,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.site.base_url,
    siteName: config.site.title,
    images: [
      {
        url: config.metadata?.meta_image || '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: config.site.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.site.title,
    description: config.metadata?.meta_description || config.site.title,
    images: [config.metadata?.meta_image || '/images/og-image.jpg'],
    creator: '@' + (config.metadata?.meta_author || config.site.title),
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
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // import google font css
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* favicon */}
        <link rel="shortcut icon" href={config.site.favicon} />
        {/* theme meta */}
        <meta name="theme-name" content="commerceplate" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#fff" />

        {/* google font css */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href={`https://fonts.googleapis.com/css2?family=${pf}${
            sf ? "&family=" + sf : ""
          }&display=swap`}
          rel="stylesheet"
        />
      </head>

      <body suppressHydrationWarning>
        <TwSizeIndicator />
        <Providers>
          <Header>
            <OpenCart />
            <Cart />
          </Header>
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
