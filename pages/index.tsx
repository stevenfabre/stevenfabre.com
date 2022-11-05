import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Steven Fabre</title>
        <meta name="description" content="CEO of Liveblocks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          I’m Steven, the co-founder of{" "}
          <a
            href="https://liveblocks.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Liveblocks
          </a>
          , a company that helps companies create collaborative products. Before
          that, I was running Easee, a web animation tool for designers that was
          acquired in April 2016 by InVision. And that eventually led me to work
          on design systems and tooling at Messenger.
        </p>

        <ul className={styles.social_links}>
          <li>
            <a
              href="https://twitter.com/stevenfabre"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </li>
          <li>
            <a
              href="http://au.linkedin.com/pub/steven-fabre/38/bb/551/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/stevenfabre"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}
