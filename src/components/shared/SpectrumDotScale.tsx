import React from 'react';
import { clamp } from '../../utils';
import { useInView } from '../../hooks/useInView';

interface Props {
  value: number;
  max?: number;
  leftLabel: string;
  rightLabel: string;
  color?: string;
  label?: string;
}

export const SpectrumDotScale: React.FC<Props> = ({ 
  value, 
  max = 100, 
  leftLabel, 
  rightLabel, 
  color = 'var(--steel)', 
  label 
}) => {
  const { ref, inView } = useInView();
  const pct = inView ? clamp(value / max * 100, 2, 98) : 2;

  return (
    <div ref={ref} className="mb-5">
      {label && (
        <div className="text-[9px] font-bold uppercase tracking-[2px] text-[var(--text-tertiary)] mb-2.5">
          {label}
        </div>
      )}
      <div className="relative h-12 w-full flex items-center">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--sand)] -translate-y-1/2" />
        
        {/* Glow */}
        <div 
          className="absolute top-1/2 w-[48px] h-[48px] rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-1200 blur-[4px] pointer-events-none"
          style={{ 
            left: `${pct}%`,
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
        />
        
        {/* Dot */}
        <div 
          className="absolute top-1/2 w-2.5 h-2.5 rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-1200"
          style={{ 
            left: `${pct}%`, 
            background: color,
            boxShadow: `0 0 12px 3px rgba(58,90,140,0.3)`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-[var(--text-tertiary)] font-medium">{leftLabel}</span>
        <span className="text-[10px] text-[var(--text-tertiary)] font-medium">{rightLabel}</span>
      </div>
    </div>
  );
};
