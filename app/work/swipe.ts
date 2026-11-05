/** Positive means next (swipe left), negative means previous. Velocity is px/ms. */
export function swipeDestination(
  offset: number,
  velocity: number,
  width: number
): -1 | 0 | 1 {
  const distance = Math.abs(offset);
  // Reversing a drag before release cancels it, even past the distance threshold.
  if (Math.abs(velocity) >= 0.5 && Math.sign(velocity) !== Math.sign(offset))
    return 0;
  const flick =
    distance >= 24 &&
    Math.abs(velocity) >= 0.5 &&
    Math.sign(velocity) === Math.sign(offset);
  if (distance < width * 0.25 && !flick) return 0;
  return offset < 0 ? 1 : -1;
}
