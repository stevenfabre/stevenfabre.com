/** Resolve a computed object-position axis against the unused (often negative)
 * space left by object-fit. Percentages refer to that space, not image width. */
export function positionOffset(value: string, space: number): number {
  if (value === "left" || value === "top") return 0;
  if (value === "right" || value === "bottom") return space;
  if (value === "center") return space / 2;
  const terms = value
    .replace(/calc\(|\)/g, "")
    .match(/[+-]?\s*\d*\.?\d+(?:%|px)/g);
  if (!terms) return space / 2;
  return terms.reduce((sum, term) => {
    const number = parseFloat(term.replace(/\s/g, ""));
    return sum + (term.endsWith("%") ? (number / 100) * space : number);
  }, 0);
}

export function objectPositionOffsets(position: string, x: number, y: number) {
  const axes = position.match(/calc\([^)]*\)|\S+/g) || [];
  return [
    positionOffset(axes[0] || "center", x),
    positionOffset(axes[1] || "center", y),
  ];
}
