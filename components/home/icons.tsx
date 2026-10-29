import { Bus, CheckCircle2, Clock, Heart, Leaf, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconName } from "@/lib/homepageData";

/** Outline icons used across the homepage, keyed by the names in the data. */
export const ICONS: Record<IconName, LucideIcon> = {
  leaf: Leaf,
  clock: Clock,
  heart: Heart,
  bus: Bus,
  users: Users,
  sparkles: Sparkles,
  check: CheckCircle2,
};

/** Icon colours taken from the mockup. */
export const ICON_COLORS: Record<IconName, string> = {
  leaf: "text-leaf-600",
  clock: "text-peach-500",
  heart: "text-rose-500",
  bus: "text-peach-500",
  users: "text-leaf-600",
  sparkles: "text-peach-400",
  check: "text-leaf-600",
};
