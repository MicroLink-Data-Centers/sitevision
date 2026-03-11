import React from 'react';

// Card
export const Card: React.FC<React.PropsWithChildren<{ accent?: string; className?: string }>> = ({ children, accent, className = '' }) => (
  <div 
    className={`bg-[var(--warm-white)] rounded-xl py-5 px-6 shadow-[0_1px_4px_rgba(15,43,76,0.04)] ${className}`}
    style={{ borderLeft: accent ? `4px solid ${accent}` : 'none' }}
  >
    {children}
  </div>
);

// SectionHead
export const SectionHead: React.FC<{ title: string; num?: string }> = ({ title, num }) => (
  <div className="flex items-center gap-2.5 mb-5 mt-5">
    {num && (
      <span className="w-[22px] h-[22px] rounded-full border-[1.5px] border-[var(--sand)] flex items-center justify-center text-[9px] font-bold text-[var(--text-tertiary)]">
        {num}
      </span>
    )}
    <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-[var(--steel)]">
      {title}
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-[var(--sand)] to-transparent" />
  </div>
);

// Callout
export const Callout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="mt-4 py-3 px-4 bg-[var(--cream)] border border-[var(--sand)] rounded-md text-[11px] text-[var(--text-secondary)] leading-relaxed italic">
    {children}
  </div>
);

// Badge
export const Badge: React.FC<React.PropsWithChildren<{ color?: string }>> = ({ children, color = 'var(--amber)' }) => (
  <span 
    className="text-[9px] font-bold uppercase tracking-[1px] py-1 px-2.5 rounded-[4px]"
    style={{ color, border: `1px solid ${color}40` }}
  >
    {children}
  </span>
);
