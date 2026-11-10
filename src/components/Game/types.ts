export type Point = {
  x: number;
  y: number;
};

export type CursorType = "mouse" | "touch";

export type RippleEvent = Point & { type: "RIPPLE"; color: string };
export type Ripple = RippleEvent & { started: number };

export type Trail = Point & { color: string; started: number };
