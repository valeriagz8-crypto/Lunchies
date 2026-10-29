import {
  BarChart3,
  CalendarDays,
  FileText,
  FolderOpen,
  Camera,
  LayoutGrid,
  Palette,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MarketingTabId } from "@/lib/marketingData";

/**
 * One palette per section, used by both the Overview card and that section's
 * banner, so a section keeps the same colour wherever it appears.
 */
export type SectionTheme = {
  icon: LucideIcon;
  /** Banner background. */
  banner: string;
  /** Overview card background and border. */
  card: string;
  /** Tint behind the icon on an Overview card. */
  iconTint: string;
  /** Accent used for chips and small highlights. */
  chip: string;
};

export const SECTION_THEME: Record<MarketingTabId, SectionTheme> = {
  overview: {
    icon: LayoutGrid,
    banner: "from-leaf-100 via-leaf-50 to-peach-50",
    card: "border-leaf-100 bg-leaf-50",
    iconTint: "bg-leaf-100",
    chip: "bg-leaf-100 text-leaf-700",
  },
  brand: {
    icon: Palette,
    banner: "from-leaf-100 via-leaf-50 to-white",
    card: "border-leaf-100 bg-leaf-50",
    iconTint: "bg-leaf-100",
    chip: "bg-leaf-100 text-leaf-700",
  },
  persona: {
    icon: Users,
    banner: "from-rose-100 via-rose-50 to-white",
    card: "border-rose-100 bg-rose-50",
    iconTint: "bg-rose-100",
    chip: "bg-rose-100 text-rose-700",
  },
  landing: {
    icon: FileText,
    banner: "from-leaf-100 via-white to-peach-50",
    card: "border-leaf-100 bg-leaf-50",
    iconTint: "bg-leaf-100",
    chip: "bg-leaf-100 text-leaf-700",
  },
  posts: {
    icon: Camera,
    banner: "from-peach-100 via-peach-50 to-white",
    card: "border-peach-100 bg-peach-50",
    iconTint: "bg-peach-100",
    chip: "bg-peach-100 text-peach-700",
  },
  scripts: {
    icon: Video,
    banner: "from-sky-100 via-sky-50 to-white",
    card: "border-sky-100 bg-sky-50",
    iconTint: "bg-sky-100",
    chip: "bg-sky-100 text-sky-700",
  },
  calendar: {
    icon: CalendarDays,
    banner: "from-rose-100 via-rose-50 to-peach-50",
    card: "border-rose-100 bg-rose-50",
    iconTint: "bg-rose-100",
    chip: "bg-rose-100 text-rose-700",
  },
  "ab-testing": {
    icon: BarChart3,
    banner: "from-leaf-100 via-leaf-50 to-sky-50",
    card: "border-leaf-100 bg-leaf-50",
    iconTint: "bg-leaf-100",
    chip: "bg-leaf-100 text-leaf-700",
  },
  saved: {
    icon: FolderOpen,
    banner: "from-amber-100 via-peach-50 to-white",
    card: "border-peach-100 bg-peach-50",
    iconTint: "bg-amber-100",
    chip: "bg-amber-100 text-amber-800",
  },
};

/** Entrance animation plus hover lift, shared by every card on the page. */
export const CARD_MOTION =
  "animate-rise transition-all duration-200 hover:-translate-y-1 hover:shadow-lg";

/** Staggers a list so cards arrive one after another. */
export function riseDelay(index: number): { animationDelay: string } {
  return { animationDelay: `${Math.min(index, 8) * 60}ms` };
}
