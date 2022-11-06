export type Pixel = {
  x: number;
  y: number;
  color: string;
  on?: boolean;
};

export type Point = {
  x: number;
  y: number;
};

export type CursorType = "mouse" | "touch";
