import type { Metadata } from "next";
import WorkPortfolio from "./WorkPortfolio";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Steven Fabre • Work",
  description: "A selection of design, tools, and teams by Steven Fabre.",
};

export default function WorkPage() {
  return (
    <div className={`${styles.page} w-full min-w-0`}>
      <WorkPortfolio />
    </div>
  );
}
