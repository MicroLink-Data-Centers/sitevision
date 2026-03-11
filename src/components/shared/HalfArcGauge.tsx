import React from 'react';
import { clamp } from '../../utils';
import { AnimatedNumber } from './AnimatedNumber';
import { useInView } from '../../hooks/useInView';

interface Props {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}

export const HalfArcGauge: React.FC<Props> = ({ value, max, label, unit, color, size = 110 }) => {
  const { ref, inView } = useInView();
  const pct = inView ? clamp(value / max, 0, 1) : 0;
  const r = (size - 16) / 2;
  const circ = Math.PI * r;

  return (
    <div ref={ref} className="text-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 12} viewBox={`0 0 ${size} ${size / 2 + 12}`}>
        <path 
          d={`M 8 ${size/2+4} A ${r} ${r} 0 0 1 ${size-8} ${size/2+4}`}
          fill="none" stroke="var(--sand)" strokeWidth={6} strokeLinecap="round" 
        />
        <path 
          d={`M 8 ${size/2+4} A ${r} ${r} 0 0 1 ${size-8} ${size/2+4}`}
          fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} 
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)" }} 
        />
      </svg>
      <div className="-mt-1 text-2xl font-extrabold text-[var(--navy)] font-sans">
        <AnimatedNumber value={value} />
      </div>
      <div className="text-[8px] text-[var(--text-tertiary)] uppercase tracking-[1.5px] mt-0.5">
        {unit}
      </div>
      <div className="text-[10px] text-[var(--text-secondary)] mt-[3px] font-medium">
        {label}
      </div>
    </div>
  );
};
