import "../src/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";

const font = Inter({ subsets: ["latin"] });

const INFO = {
  name: "Steven Fabre",
  twitter: "@stevenfabre",
  description:
    "Steven Fabre is a designer and founder who loves building tools for people.",
  url: "https://stevenfabre.com",
  metaImage: "/meta.png",
};

export const metadata: Metadata = {
  title: INFO.name,
  description: INFO.description,
  openGraph: {
    type: "website",
    title: INFO.name,
    description: INFO.description,
    url: INFO.url,
    images: INFO.metaImage,
  },
  twitter: {
    title: INFO.name,
    card: "summary_large_image",
    site: INFO.twitter,
    creator: INFO.twitter,
    images: INFO.metaImage,
  },
  metadataBase: new URL(INFO.url),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <head>
        <meta content="initial-scale=1, viewport-fit=cover" name="viewport" />
      </head>
      <body>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
