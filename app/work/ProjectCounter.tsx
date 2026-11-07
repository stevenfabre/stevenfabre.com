"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import RollingNumber from "../../src/components/RollingNumber";

const CounterHistory = createContext<MutableRefObject<number | null> | null>(
  null
);

export function ProjectCounterProvider({ children }: { children: ReactNode }) {
  const previous = useRef<number | null>(null);
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (pathname === "/work") previous.current = null;
  }, [pathname]);
  return (
    <CounterHistory.Provider value={previous}>
      {children}
    </CounterHistory.Provider>
  );
}

export default function ProjectCounter({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const history = useContext(CounterHistory);
  const [previous, setPrevious] = useState(current);
  useLayoutEffect(() => {
    if (!history || history.current === current) return;
    setPrevious(history.current ?? current);
    history.current = current;
  }, [current, history]);
  const direction =
    current === 1 && previous === total
      ? 1
      : current === total && previous === 1
      ? -1
      : current > previous
      ? 1
      : -1;
  return (
    <span
      className="flex items-center px-1 text-xs tabular-nums"
      aria-label={`Project ${current} of ${total}`}
    >
      <RollingNumber
        value={current}
        previous={previous}
        direction={direction}
        minDigits={2}
      />
      <span aria-hidden="true" className="ml-1 flex h-6 items-center leading-4">
        / {String(total).padStart(2, "0")}
      </span>
    </span>
  );
}
