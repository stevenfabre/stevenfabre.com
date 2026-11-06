import type { ComponentProps } from "react";
import Icon from "../../src/components/Icon";

const responsibilityIcons: Record<string, ComponentProps<typeof Icon>["name"]> =
  {
    Design: "design",
    Engineering: "engineering",
    "Video production": "film",
    Concept: "concept",
    "Art direction": "palette",
    Marketing: "marketing",
    "Marketing campaign": "marketing",
    Messaging: "messaging",
    Positioning: "positioning",
    "AI video": "sparkles",
    Research: "research",
    Animation: "animation",
    Branding: "branding",
  };

export default function ResponsibilityIcon({ name }: { name: string }) {
  return (
    <Icon
      name={responsibilityIcons[name] ?? "layers"}
      size={14}
      className="mt-1 shrink-0 opacity-70"
    />
  );
}
