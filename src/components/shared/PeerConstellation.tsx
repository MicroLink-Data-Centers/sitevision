import React from 'react';
import type { Site } from '../../types/site';

interface Props {
  site: Site;
  peers: Site[];
}

export const PeerConstellation: React.FC<Props> = ({ site, peers }) => {
  const allSites = [site, ...peers];
  const maxHDV = Math.max(...allSites.map(s => s.h)) * 1.1;
  const maxTh = Math.max(...allSites.map(s => s.th)) * 1.1;
  const w = 400, h = 200, pad = 40;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 20}`} className="max-w-[440px]">
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(p => (
        <line key={`h${p}`} 
          x1={pad} x2={w - 10} 
          y1={pad + (h - pad * 2) * (1 - p)} 
          y2={pad + (h - pad * 2) * (1 - p)}
          stroke="var(--sand)" strokeWidth={0.5} 
        />
      ))}

      {/* Axis labels */}
      <text x={pad - 4} y={h - pad + 16} className="text-[8px] fill-[var(--text-tertiary)]" textAnchor="end">0</text>
      <text x={w / 2} y={h + 12} textAnchor="middle" className="text-[8px] fill-[var(--text-tertiary)] uppercase tracking-[1px]">
        Thermal Load (kW) →
      </text>
      <text x={8} y={(h - pad) / 2 + pad} className="text-[8px] fill-[var(--text-tertiary)]" transform={`rotate(-90,8,${(h-pad)/2+pad})`} textAnchor="middle">
        HDV Index →
      </text>

      {/* Peer dots */}
      {peers.map((p, i) => {
        const cx = pad + (p.th / maxTh) * (w - pad - 10);
        const cy = pad + (1 - p.h / maxHDV) * (h - pad * 2);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={Math.max(3, p.mw / 5)} fill="var(--ice)" stroke="var(--sand)" strokeWidth={1} />
            <text x={cx} y={cy - 8} textAnchor="middle" className="text-[7px] fill-[var(--text-tertiary)]">
              {p.n.split(" ").slice(0, 2).join(" ")}
            </text>
          </g>
        );
      })}

      {/* Current site — with glow */}
      {(() => {
        const cx = pad + (site.th / maxTh) * (w - pad - 10);
        const cy = pad + (1 - site.h / maxHDV) * (h - pad * 2);
        return (
          <g>
            <circle cx={cx} cy={cy} r={20} fill="var(--steel)" opacity={0.15} />
            <circle cx={cx} cy={cy} r={12} fill="var(--steel)" opacity={0.25} />
            <circle cx={cx} cy={cy} r={Math.max(5, site.mw / 4)} fill="var(--steel)" stroke="#fff" strokeWidth={2} />
            <text x={cx} y={cy - 14} textAnchor="middle" className="text-[8px] font-bold fill-[var(--navy)]">
              This Site
            </text>
          </g>
        );
      })()}
    </svg>
  );
};
