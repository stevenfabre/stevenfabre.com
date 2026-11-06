/** Positive means next (swipe left), negative means previous. Velocity is px/ms. */
export function swipeDestination(
  offset: number,
  velocity: number,
  width: number
): -1 | 0 | 1 {
  const distance = Math.abs(offset);
  // Speed alone shouldn't turn a small finger movement into navigation.
  // Require a deliberate drag even for a flick, scaled to the viewport.
  const minimumFlickDistance = Math.max(80, width * 0.2);
  // Reversing a drag before release cancels it, even past the distance threshold.
  if (Math.abs(velocity) >= 0.5 && Math.sign(velocity) !== Math.sign(offset))
    return 0;
  const flick =
    distance >= minimumFlickDistance &&
    Math.abs(velocity) >= 0.65 &&
    Math.sign(velocity) === Math.sign(offset);
  if (distance < width / 3 && !flick) return 0;
  return offset < 0 ? 1 : -1;
}
