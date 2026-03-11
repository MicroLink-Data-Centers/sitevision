import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

interface Props {
  value: number | string;
  unit?: string;
  label: string;
  color?: string;
  sub?: string;
  decimals?: number;
}

export const MetricBig: React.FC<Props> = ({ 
  value, 
  unit, 
  label, 
  color = 'var(--navy)', 
  sub, 
  decimals = 0 
}) => (
  <div className="py-3">
    <div className="flex items-baseline gap-1">
      <span className="text-[48px] font-extrabold font-sans leading-none" style={{ color }}>
        {typeof value === 'number' ? <AnimatedNumber value={value} decimals={decimals} /> : value}
      </span>
      {unit && <span className="text-[11px] text-[var(--text-tertiary)] font-normal ml-1">{unit}</span>}
    </div>
    <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[2px] mt-1.5">
      {label}
    </div>
    {sub && (
      <div className="text-[10px] text-[var(--text-secondary)] mt-1 italic">
        {sub}
      </div>
    )}
  </div>
);
