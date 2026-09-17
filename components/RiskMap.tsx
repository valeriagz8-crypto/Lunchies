"use client";

import { useState } from "react";
import { TYPE_COLORS, type Competitor } from "@/lib/researchData";

const SIZE = 400;
const PADDING = 32;

function toSvgCoords(saturation: number, threat: number) {
  const usable = SIZE - PADDING * 2;
  const x = PADDING + (saturation / 100) * usable;
  // Threat grows upward, but SVG y grows downward.
  const y = PADDING + (1 - threat / 100) * usable;
  return { x, y };
}

export default function RiskMap({ competitors }: { competitors: Competitor[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const mid = PADDING + (SIZE - PADDING * 2) / 2;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-md"
        role="img"
        aria-label="Risk map: market saturation vs threat level for each competitor"
      >
        <rect
          x={PADDING}
          y={PADDING}
          width={SIZE - PADDING * 2}
          height={SIZE - PADDING * 2}
          fill="#f2faf4"
          stroke="#c2e6cb"
        />
        <line
          x1={mid}
          y1={PADDING}
          x2={mid}
          y2={SIZE - PADDING}
          stroke="#c2e6cb"
          strokeDasharray="4 4"
        />
        <line
          x1={PADDING}
          y1={mid}
          x2={SIZE - PADDING}
          y2={mid}
          stroke="#c2e6cb"
          strokeDasharray="4 4"
        />

        {/* Axis labels */}
        <text x={PADDING} y={SIZE - PADDING + 18} fontSize="11" fill="#27633c">
          Low
        </text>
        <text
          x={SIZE - PADDING}
          y={SIZE - PADDING + 18}
          fontSize="11"
          fill="#27633c"
          textAnchor="end"
        >
          High
        </text>
        <text
          x={SIZE / 2}
          y={SIZE - 4}
          fontSize="12"
          fill="#224f33"
          textAnchor="middle"
          fontWeight="600"
        >
          Market saturation
        </text>

        <text
          x={PADDING - 8}
          y={SIZE - PADDING}
          fontSize="11"
          fill="#27633c"
          textAnchor="end"
        >
          Low
        </text>
        <text x={PADDING - 8} y={PADDING + 4} fontSize="11" fill="#27633c" textAnchor="end">
          High
        </text>
        <text
          x={14}
          y={SIZE / 2}
          fontSize="12"
          fill="#224f33"
          textAnchor="middle"
          fontWeight="600"
          transform={`rotate(-90 14 ${SIZE / 2})`}
        >
          Threat level
        </text>

        {competitors.map((c) => {
          const { x, y } = toSvgCoords(c.saturation, c.threat);
          const isHovered = hovered === c.name;
          return (
            <g
              key={c.name}
              onMouseEnter={() => setHovered(c.name)}
              onMouseLeave={() => setHovered((prev) => (prev === c.name ? null : prev))}
            >
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 8 : 6}
                fill={TYPE_COLORS[c.type]}
                stroke="white"
                strokeWidth={1.5}
                className="cursor-pointer transition-all"
              />
              <text
                x={x}
                y={y - 10}
                fontSize="10"
                fill="#224f33"
                textAnchor="middle"
                fontWeight={isHovered ? 700 : 500}
              >
                {c.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-leaf-700">
        {(Object.keys(TYPE_COLORS) as Competitor["type"][]).map((type) => (
          <span key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[type] }}
              aria-hidden="true"
            />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
