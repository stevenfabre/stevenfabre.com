import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import { Familjen_Grotesk } from "@next/font/google";
import { ThemeProvider } from "next-themes";

const font = Familjen_Grotesk();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
