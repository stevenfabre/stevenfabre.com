import { ProjectCounterProvider } from "./ProjectCounter";
import type { ReactNode } from "react";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return <ProjectCounterProvider>{children}</ProjectCounterProvider>;
}
