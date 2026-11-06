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
    Messaging: "messaging",
    Positioning: "positioning",
    Research: "research",
    Animation: "animation",
    Branding: "palette",
  };

export default function ResponsibilityIcon({ name }: { name: string }) {
  return (
    <Icon
      name={responsibilityIcons[name] ?? "layers"}
      size={12}
      className="shrink-0 opacity-70"
    />
  );
}
