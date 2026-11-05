"use client";

import { useState } from "react";
import styles from "./RollingNumber.module.css";

function Digit({
  value,
  previous,
  direction,
}: {
  value: string;
  previous: string;
  direction: number;
}) {
  const changed = previous !== value;
  return (
    <span
      className={styles.digit}
      data-direction={direction}
      aria-hidden="true"
    >
      <span key={value} className={changed ? styles.roll : undefined}>
        {changed && <span className={styles.previous}>{previous}</span>}
        <span>{value}</span>
      </span>
    </span>
  );
}

export default function RollingNumber({
  value,
  previous,
  direction,
  minDigits = 1,
}: {
  value: number;
  previous?: number;
  direction?: number;
  minDigits?: number;
}) {
  const [history, setHistory] = useState({ current: value, previous: value });
  if (history.current !== value) {
    setHistory({ current: value, previous: history.current });
  }
  const from = previous ?? history.previous;
  const digits = String(value).padStart(minDigits, "0");
  const oldDigits = String(from)
    .padStart(minDigits, "0")
    .padStart(digits.length, " ");
  return (
    <span
      className="inline-flex items-center tabular-nums"
      aria-label={String(value)}
    >
      {Array.from(digits).map((digit, index) => (
        <Digit
          key={digits.length - index}
          value={digit}
          previous={oldDigits[oldDigits.length - digits.length + index]}
          direction={direction ?? (value >= from ? 1 : -1)}
        />
      ))}
    </span>
  );
}
