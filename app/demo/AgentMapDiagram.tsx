import type { LucideIcon } from "lucide-react";
import { Apple } from "lucide-react";
import { TINT, type TintName } from "@/components/ui/theme";

/**
 * The radial module diagram from the mockup: a green hub with solid arrows
 * out to the five modules that really run in this project, and dashed arcs
 * running around the ring from one module to the next.
 *
 * Everything is sized as a percentage of one viewBox, so the boxes, the
 * arrows and the hub keep their positions at any width. The boxes are HTML
 * rather than SVG text, so their labels stay selectable and crisp.
 */

const VB = { w: 860, h: 470 };
const HUB = { x: 430, y: 235 };

export type DiagramNode = {
  name: string;
  short: string;
  icon: LucideIcon;
  tint: TintName;
  /** Centre of the node, in viewBox units. */
  x: number;
  y: number;
};

/** Half the size of a box, in viewBox units, for the arrow geometry. */
const NODE_HALF = { w: 164, h: 56 };
const HUB_HALF = { w: 95, h: 68 };

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

/** An arc that bows away from the hub, so the ring reads as a circle. */
function ringArc(a: DiagramNode, b: DiagramNode) {
  const from = unit(b.x - a.x, b.y - a.y);
  const start = exitPoint(a.x, a.y, from.ux, from.uy, NODE_HALF, 6);
  const end = exitPoint(b.x, b.y, -from.ux, -from.uy, NODE_HALF, 10);
  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2;
  const out = unit(mx - HUB.x, my - HUB.y);
  const bow = 46;
  return `M ${start.x} ${start.y} Q ${mx + out.ux * bow} ${my + out.uy * bow} ${end.x} ${end.y}`;
}

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export default function AgentMapDiagram({ nodes }: { nodes: DiagramNode[] }) {
  const ring = [...nodes].sort(
    (a, b) =>
      Math.atan2(a.y - HUB.y, a.x - HUB.x) - Math.atan2(b.y - HUB.y, b.x - HUB.x),
  );

  return (
    <div
      className="relative mx-auto hidden w-full lg:block"
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
            markerWidth="5.5"
            markerHeight="5.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2f7d49" />
          </marker>
        </defs>

        {/* The ring: one dashed arc from each module to the next, taken
            around the circle rather than in the order the data lists them. */}
        {ring.map((n, i) => (
          <path
            key={`ring-${n.name}`}
            d={ringArc(n, ring[(i + 1) % ring.length])}
            fill="none"
            stroke="#5aa06d"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeDasharray="10 10"
            markerEnd="url(#agent-arrow)"
            opacity="0.85"
          />
        ))}

        {/* The hub feeding each module. */}
        {nodes.map((n) => {
          const { ux, uy } = unit(n.x - HUB.x, n.y - HUB.y);
          const a = exitPoint(HUB.x, HUB.y, ux, uy, HUB_HALF, 8);
          const b = exitPoint(n.x, n.y, -ux, -uy, NODE_HALF, 11);
          return (
            <path
              key={`spoke-${n.name}`}
              d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
              fill="none"
              stroke="#2f7d49"
              strokeWidth="3"
              strokeLinecap="round"
              markerEnd="url(#agent-arrow)"
            />
          );
        })}
      </svg>

      {/* Hub */}
      <div
        className="absolute flex h-[25%] w-[22%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[26px] bg-leaf-700 text-white shadow-soft-lg"
        style={{ left: pct(HUB.x, VB.w), top: pct(HUB.y, VB.h) }}
      >
        <Apple className="h-7 w-7" strokeWidth={2.2} />
        <span className="mt-1 font-poppins text-[16px] font-extrabold leading-tight">
          Lunchies
        </span>
        <span className="text-[10.5px] font-semibold text-leaf-100">modules</span>
      </div>

      {/* Nodes */}
      {nodes.map((n) => {
        const tint = TINT[n.tint];
        const Icon = n.icon;
        return (
          <div
            key={n.name}
            className={`absolute flex w-[38%] -translate-x-1/2 -translate-y-1/2 items-start gap-2.5 rounded-2xl border px-3 py-2.5 shadow-sm ${tint.card}`}
            style={{ left: pct(n.x, VB.w), top: pct(n.y, VB.h) }}
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 ${tint.badgeInk}`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block font-poppins text-[14px] font-extrabold leading-tight text-leaf-900">
                {n.name}
              </span>
              <span className="mt-0.5 block text-[12px] leading-snug text-leaf-700">
                {n.short}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
