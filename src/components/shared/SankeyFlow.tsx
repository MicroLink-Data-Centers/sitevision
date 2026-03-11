import React, { useState, useEffect } from 'react';
import type { Site } from '../../types/site';
import { fmt } from '../../utils';
import { useInView } from '../../hooks/useInView';

interface Props {
  site: Site;
}

export const SankeyFlow: React.FC<Props> = ({ site }) => {
  const { ref, inView } = useInView();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const t = setTimeout(() => setProgress(1), 200);
    return () => clearTimeout(t);
  }, []);

  const labels = site.cat === "WWTP" ? {
    source: "Biogas", process: "Digester Heating", capture: "MicroLink Compute", return: "Hot Water to Plant",
    sourceDetail: "Anaerobic digestion produces methane", returnDetail: "Replaces boiler gas demand"
  } : site.cat === "BREWERY" ? {
    source: "Natural Gas", process: "Brewing Process", capture: "MicroLink Compute", return: "Hot Water Return",
    sourceDetail: "Mashing, boiling, pasteurisation", returnDetail: "Cleaning, mashing pre-heat"
  } : {
    source: "CHP Plant", process: "Campus Heating", capture: "MicroLink Compute", return: "Supplemental Heat",
    sourceDetail: "Combined heat & power generation", returnDetail: "District energy integration"
  };

  const w = 480, h = 220;
  const nodeW = 6;
  const nodes = [
    { x: 20, y: 40, h: 80, color: 'var(--amber)', label: labels.source },
    { x: 160, y: 30, h: 100, color: 'var(--text-tertiary)', label: labels.process },
    { x: 300, y: 50, h: 70, color: 'var(--steel)', label: labels.capture },
    { x: 430, y: 60, h: 55, color: 'var(--verdant)', label: labels.return },
  ];

  const flowPath = (from: any, to: any, yOff = 0) => {
    const x1 = from.x + nodeW, y1 = from.y + from.h * 0.3 + yOff;
    const x2 = to.x, y2 = to.y + to.h * 0.3 + yOff;
    const cx1 = x1 + (x2 - x1) * 0.4, cx2 = x1 + (x2 - x1) * 0.6;
    const bw1 = from.h * 0.5, bw2 = to.h * 0.5;
    return `M${x1},${y1 - bw1/2} C${cx1},${y1 - bw1/2} ${cx2},${y2 - bw2/2} ${x2},${y2 - bw2/2}
            L${x2},${y2 + bw2/2} C${cx2},${y2 + bw2/2} ${cx1},${y1 + bw1/2} ${x1},${y1 + bw1/2} Z`;
  };

  const wastePath = () => {
    const from = nodes[1], to = nodes[2];
    const x1 = from.x + nodeW, y1 = from.y + from.h * 0.7;
    const x2 = to.x, y2 = to.y + to.h * 0.4;
    const cx1 = x1 + (x2-x1)*0.5, cx2 = x1 + (x2-x1)*0.5;
    return `M${x1},${y1-15} C${cx1},${y1-15} ${cx2},${y2-15} ${x2},${y2-15}
            L${x2},${y2+15} C${cx2},${y2+15} ${cx1},${y1+15} ${x1},${y1+15} Z`;
  };

  return (
    <div ref={ref} className="w-full h-full relative" style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease-out' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h + 40}`} preserveAspectRatio="xMidYMid meet" className="max-w-[520px] transition-opacity duration-800 ease-in-out" style={{ opacity: progress }}>
        <defs>
          <linearGradient id="flow1" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--text-tertiary)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="flow2" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--text-tertiary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--steel)" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="flow3" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--steel)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--verdant)" stopOpacity="0.3" />
          </linearGradient>
          <filter id="sankeyglow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <path d={flowPath(nodes[0], nodes[1])} fill="url(#flow1)" />
        <path d={wastePath()} fill="url(#flow2)" filter="url(#sankeyglow)" />
        <path d={flowPath(nodes[2], nodes[3])} fill="url(#flow3)" />

        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width={nodeW} height={n.h} rx={3} fill={n.color}
              className="transition-opacity duration-600 ease-in-out" 
              style={{ opacity: progress, transitionDelay: `${i*150}ms` }} />
            <text x={n.x + nodeW/2} y={n.y - 8} textAnchor="middle" fill={n.color}
              className="text-[9px] font-bold uppercase tracking-[0.5px]">
              {n.label}
            </text>
          </g>
        ))}

        <text x={90} y={65} textAnchor="middle" fill="var(--amber)" className="text-lg font-extrabold opacity-70">100%</text>
        <text x={230} y={95} textAnchor="middle" fill="var(--steel)" className="text-sm font-bold opacity-80">
          {site.th ? `${fmt(site.th)} kW` : "—"}
        </text>
        <text x={370} y={85} textAnchor="middle" fill="var(--verdant)" className="text-sm font-bold opacity-80">→ Host</text>

        <text x={90} y={h + 10} textAnchor="middle" fill="var(--text-tertiary)" className="text-[8px] italic">
          {labels.sourceDetail}
        </text>
        <text x={370} y={h + 10} textAnchor="middle" fill="var(--text-tertiary)" className="text-[8px] italic">
          {labels.returnDetail}
        </text>

        <rect x={nodes[2].x - 30} y={nodes[2].y + nodes[2].h + 8} width={66} height={18} rx={9} fill="var(--steel)" />
        <text x={nodes[2].x + 3} y={nodes[2].y + nodes[2].h + 20} textAnchor="middle" fill="#fff"
          className="text-[7px] font-bold tracking-[0.5px]">MICROLINK</text>

        {/* Compute Details Line */}
        <path d={`M${nodes[2].x + 3},${nodes[2].y + nodes[2].h + 26} L${nodes[2].x + 3},${nodes[2].y + nodes[2].h + 60}`} stroke="var(--steel)" strokeWidth={1} strokeDasharray="3,3" opacity={0.6} className="transition-opacity duration-1000 delay-500" style={{ opacity: progress ? 0.6 : 0 }} />
        <text x={nodes[2].x + 8} y={nodes[2].y + nodes[2].h + 46} fill="var(--steel)" className="text-[8px] font-bold tracking-[0.5px] transition-opacity duration-1000 delay-500" style={{ opacity: progress ? 1 : 0 }}>
          GPU Servers · Liquid Cooled · {site.mw} MW
        </text>
      </svg>
    </div>
  );
};
