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

/**
 * Arrows run between the two boxes, not between their centres: both ends are
 * the point where the line leaves the box, so an arrowhead never hides
 * underneath a node.
 */
const VB_PER_PX = VB.w / 660; // the diagram's max rendered width
const NODE_HALF = { w: (168 / 2) * VB_PER_PX, h: (48 / 2) * VB_PER_PX };
const HUB_HALF = { w: (156 / 2) * VB_PER_PX, h: (126 / 2) * VB_PER_PX };

function exitPoint(
  cx: number,
  cy: number,
  ux: number,
  uy: number,
  half: { w: number; h: number },
  gap: number,
) {
  const tx = Math.abs(ux) > 1e-6 ? half.w / Math.abs(ux) : Infinity;
  const ty = Math.abs(uy) > 1e-6 ? half.h / Math.abs(uy) : Infinity;
  const t = Math.min(tx, ty) + gap;
  return { x: cx + ux * t, y: cy + uy * t };
}

function unit(x: number, y: number) {
  const len = Math.hypot(x, y) || 1;
  return { ux: x / len, uy: y / len };
}

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export default function AgentMapDiagram({ nodes }: { nodes: DiagramNode[] }) {
  return (
    <div
      className="relative mx-auto hidden w-full max-w-[660px] lg:block"
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
          const { ux, uy } = unit(n.x - HUB.x, n.y - HUB.y);
          const a = exitPoint(HUB.x, HUB.y, ux, uy, HUB_HALF, 10);
          const b = exitPoint(n.x, n.y, -ux, -uy, NODE_HALF, 12);
          // A gentle bow, perpendicular to the line, like the mockup's arcs.
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const nx = -(b.y - a.y);
          const ny = b.x - a.x;
          const nl = Math.hypot(nx, ny) || 1;
          const seg = Math.hypot(b.x - a.x, b.y - a.y);
          const bow = Math.min(18, seg * 0.12);
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
        className="absolute flex h-[126px] w-[156px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl bg-leaf-700 text-white shadow-soft-lg"
        style={{ left: pct(HUB.x, VB.w), top: pct(HUB.y, VB.h) }}
      >
        <Apple className="h-7 w-7" strokeWidth={2.2} />
        <span className="mt-1 font-poppins text-[17px] font-extrabold leading-tight">
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
            className={`absolute flex w-[168px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border px-3 py-2.5 shadow-sm ${tint.card}`}
            style={{ left: pct(n.x, VB.w), top: pct(n.y, VB.h) }}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 ${tint.badgeInk}`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="font-poppins text-[14px] font-extrabold leading-tight text-leaf-900">
              {n.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
