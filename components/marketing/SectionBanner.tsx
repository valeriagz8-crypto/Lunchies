import Spark from "@/components/home/Spark";
import { SECTION_THEME } from "./theme";
import type { MarketingTabId } from "@/lib/marketingData";

/**
 * The banner every section opens with: a pastel gradient matching the
 * section's Overview card, its outline icon in a white circle, the title with
 * an orange spark, a one-line subtitle, and a decoration on the right.
 */
export default function SectionBanner({
  tabId,
  title,
  subtitle,
  note,
  actions,
}: {
  tabId: MarketingTabId;
  title: string;
  subtitle: string;
  /** Optional handwritten note shown in the decoration. */
  note?: string;
  actions?: React.ReactNode;
}) {
  const theme = SECTION_THEME[tabId];
  const Icon = theme.icon;

  return (
    <div
      className={`animate-rise relative overflow-hidden rounded-3xl bg-gradient-to-r p-6 sm:p-8 ${theme.banner}`}
    >
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm sm:h-20 sm:w-20">
            <Icon
              className="h-8 w-8 text-leaf-700 sm:h-9 sm:w-9"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h2 className="font-poppins flex flex-wrap items-center gap-1.5 text-2xl font-extrabold text-leaf-900 sm:text-3xl">
              {title}
              <Spark />
            </h2>
            <p className="mt-1 text-sm text-leaf-700 sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {actions}
          {note && (
            <p
              aria-hidden="true"
              className="font-caveat hidden max-w-[12rem] -rotate-3 text-right text-xl leading-tight text-leaf-600/90 lg:block"
            >
              {note}
            </p>
          )}
        </div>
      </div>

      {/* Decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-8 hidden h-40 w-40 rounded-full bg-white/40 blur-xl lg:block"
      />
    </div>
  );
}
