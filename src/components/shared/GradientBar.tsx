import React from 'react';
import { clamp } from '../../utils';

interface Props {
  value: number;
  max: number;
  label: string;
  color: string;
  unit?: string;
}

export const GradientBar: React.FC<Props> = ({ value, max, label, color, unit }) => {
  const pct = clamp(value / max * 100, 1, 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-[11px] text-[var(--text-secondary)] font-medium">{label}</span>
        <span className="text-[11px] text-[var(--navy)] font-bold font-sans">
          {typeof value === "number" ? value.toLocaleString() : value}{unit ? ` ${unit}` : ""}
        </span>
      </div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 bg-[var(--sand)] rounded-[3px]" />
        <div 
          className="absolute left-0 top-0 h-full rounded-[3px] transition-all duration-1200"
          style={{ 
            width: `${pct}%`,
            background: `linear-gradient(90deg, transparent, ${color})`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
        />
        <div 
          className="absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-1200"
          style={{ 
            left: `${pct}%`, 
            background: color,
            boxShadow: `0 0 6px 2px ${color}30`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
        />
      </div>
    </div>
  );
};
