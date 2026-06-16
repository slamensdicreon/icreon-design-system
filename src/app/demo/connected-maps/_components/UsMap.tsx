"use client";

import { ASPECT, STATE_PATHS, VIEWBOX, project } from "../_lib/geo";
import { colorFor } from "../_data/subsidiaries";
import type { Position } from "../_data/positions";

type Props = {
  positions: Position[];
  /** Sibling-brand roles shown faintly (cross-brand visibility). */
  ghosts?: Position[];
  pulseIds?: Set<string>;
  onMarkerClick?: (pos: Position) => void;
  compact?: boolean;
};

export default function UsMap({
  positions,
  ghosts = [],
  pulseIds,
  onMarkerClick,
  compact = false,
}: Props) {
  const r = compact ? 0.95 : 0.55;
  const stateStroke = compact ? 0.12 : 0.08;

  return (
    <svg
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", aspectRatio: String(ASPECT), display: "block" }}
      role="img"
      aria-label="United States map of open positions"
    >
      <rect
        x={VIEWBOX.x}
        y={VIEWBOX.y}
        width={VIEWBOX.w}
        height={VIEWBOX.h}
        fill="#f8fafc"
      />
      {STATE_PATHS.map((s) => (
        <path
          key={s.id}
          d={s.d}
          fill="#e9eef5"
          stroke="#cbd5e1"
          strokeWidth={stateStroke}
          strokeLinejoin="round"
        />
      ))}

      {/* sibling-brand roles: hollow, faded */}
      {ghosts.map((p) => {
        const [x, y] = project([p.lng, p.lat]);
        return (
          <circle
            key={`ghost-${p.id}`}
            cx={x}
            cy={y}
            r={r * 0.8}
            fill="#fff"
            stroke={colorFor(p.brand)}
            strokeWidth={r * 0.28}
            opacity={0.5}
          />
        );
      })}

      {/* this surface's own roles */}
      {positions.map((p) => {
        const [x, y] = project([p.lng, p.lat]);
        const color = colorFor(p.brand);
        const pulsing = pulseIds?.has(p.id);
        return (
          <g
            key={p.id}
            onClick={onMarkerClick ? () => onMarkerClick(p) : undefined}
            style={{ cursor: onMarkerClick ? "pointer" : "default" }}
          >
            <title>{`${p.title} — ${p.city}, ${p.state}`}</title>
            {pulsing && (
              <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={r * 0.4}>
                <animate attributeName="r" from={r} to={r * 3.5} dur="1.1s" repeatCount="3" />
                <animate attributeName="opacity" from="0.9" to="0" dur="1.1s" repeatCount="3" />
              </circle>
            )}
            <circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth={r * 0.3} />
          </g>
        );
      })}
    </svg>
  );
}
