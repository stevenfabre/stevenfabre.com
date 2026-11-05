import type { SVGProps } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  LayoutGrid,
  X,
  Image,
  Layers,
  Moon,
  Sun,
  Pause,
  Play,
  Users,
  Mail,
  Check,
  CircleAlert,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";

const icons = {
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-right": ArrowUpRight,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "grid-2x2": Grid2X2,
  "layout-grid": LayoutGrid,
  x: X,
  image: Image,
  layers: Layers,
  moon: Moon,
  sun: Sun,
  pause: Pause,
  play: Play,
  users: Users,
  envelope: Mail,
  check: Check,
  error: CircleAlert,
  volume: Volume2,
  "volume-off": VolumeX,
  maximize: Maximize,
};

export default function Icon({
  name,
  size = 20,
  ...props
}: Omit<SVGProps<SVGSVGElement>, "ref"> & { name: keyof typeof icons; size?: number }) {
  const Component = icons[name];
  return (
    <Component
      width={size}
      height={size}
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}
