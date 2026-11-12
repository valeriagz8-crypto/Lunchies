import type { LucideIcon } from "lucide-react";
import { Apple } from "lucide-react";
import { TINT, type TintName } from "@/components/ui/theme";

/**
 * The radial module diagram from the mockup: a green hub with arrows out to
 * the five modules that really run in this project.
 *
 * Geometry lives in one viewBox so the arrows and the nodes stay aligned at
 * any width: the SVG scales with the container and every node is positioned
 * with the same percentage coordinates the paths are drawn from.
 */

const VB = { w: 800, h: 560 };
const HUB = { x: 400, y: 280 };

export type DiagramNode = {
  name: string;
  icon: LucideIcon;
  tint: TintName;
  /** Centre of the node, in viewBox units. */
  x: number;
  y: number;
};

/** Where each arrow should stop, pulled back so it meets the node edge. */
function edge(x: number, y: number, pull = 52) {
  const dx = x - HUB.x;
  const dy = y - HUB.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: x - (dx / len) * pull, y: y - (dy / len) * pull };
}

/** Where each arrow starts, just outside the hub. */
function start(x: number, y: number, pull = 92) {
  const dx = x - HUB.x;
  const dy = y - HUB.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: HUB.x + (dx / len) * pull, y: HUB.y + (dy / len) * pull };
}

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export default function AgentMapDiagram({ nodes }: { nodes: DiagramNode[] }) {
  return (
    <div
      className="relative mx-auto hidden w-full max-w-[620px] lg:block"
      style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="absolute inset-0 h-full w-full"
        focusable="false"
      >
        <defs>
          <marker
            id="agent-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2f7d49" />
          </marker>
        </defs>
        {nodes.map((n) => {
          const a = start(n.x, n.y);
          const b = edge(n.x, n.y);
          // A gentle bow, perpendicular to the line, like the mockup's arcs.
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const nx = -(b.y - a.y);
          const ny = b.x - a.x;
          const nl = Math.hypot(nx, ny) || 1;
          const bow = 16;
          const cx = mx + (nx / nl) * bow;
          const cy = my + (ny / nl) * bow;
          return (
            <path
              key={n.name}
              d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
              fill="none"
              stroke="#2f7d49"
              strokeWidth="2.6"
              strokeLinecap="round"
              markerEnd="url(#agent-arrow)"
              opacity="0.85"
            />
          );
        })}
      </svg>

      {/* Hub */}
      <div
        className="absolute flex h-[108px] w-[132px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl bg-leaf-700 text-white shadow-soft-lg"
        style={{ left: pct(HUB.x, VB.w), top: pct(HUB.y, VB.h) }}
      >
        <Apple className="h-6 w-6" strokeWidth={2.2} />
        <span className="mt-1 font-poppins text-[15px] font-extrabold leading-tight">
          Lunchies
        </span>
        <span className="text-[11px] font-semibold text-leaf-100">modules</span>
      </div>

      {/* Nodes */}
      {nodes.map((n) => {
        const tint = TINT[n.tint];
        const Icon = n.icon;
        return (
          <div
            key={n.name}
            className={`absolute flex w-[124px] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-2xl border px-2.5 py-2 shadow-sm ${tint.card}`}
            style={{ left: pct(n.x, VB.w), top: pct(n.y, VB.h) }}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 ${tint.badgeInk}`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="font-poppins text-[12px] font-extrabold leading-tight text-leaf-900">
              {n.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
