import "../src/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Person, WithContext } from "schema-dts";

const font = Inter({ subsets: ["latin"] });

const INFO = {
  name: "Steven Fabre",
  twitter: "@stevenfabre",
  description:
    "Steven Fabre is a designer and founder who loves building tools for people.",
  url: "https://stevenfabre.com",
  metaImage: "/meta.png",
  image: "/steven-fabre.jpg",
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

const jsonLd: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: INFO.name,
  image: INFO.image,
  description: INFO.description,
  familyName: "Fabre",
  email: "hello@stevenfabre.com",
  worksFor: "Liveblocks",
  jobTitle: "CEO",
  knowsAbout: "design, product, engineering, entrepreneurship, ai",
  birthDate: "1990-04-18",
  birthPlace: "Rodez, France",
  nationality: ["France", "Australia"],
  sameAs: [
    "https://www.linkedin.com/in/steven-fabre-5510bb38",
    "https://github.com/stevenfabre",
    "https://x.com/stevenfabre",
    "https://www.instagram.com/stevenfabre",
    "https://medium.com/@stevenfabre",
    "https://bsky.app/profile/stevenfabre.com",
    "https://www.youtube.com/@StevenFabre",
    "https://dribbble.com/stevenfabre",
    "https://www.producthunt.com/@stevenfabre",
  ],
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
        <ThemeProvider attribute="class">
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
