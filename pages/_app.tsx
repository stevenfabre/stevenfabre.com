import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import { Familjen_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

const font = Familjen_Grotesk({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <main className={font.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </ThemeProvider>
  );
}
