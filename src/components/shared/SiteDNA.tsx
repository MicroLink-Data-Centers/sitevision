import React from 'react';
import type { Site } from '../../types/site';
import { clamp, connVal } from '../../utils';

interface Props {
  site: Site;
}

export const SiteDNA: React.FC<Props> = ({ site }) => {
  const metrics = [
    { v: site.mw / 100, c: 'var(--navy)' },
    { v: site.h / 130, c: 'var(--steel)' },
    { v: site.e / 0.25, c: 'var(--mid-blue)' },
    { v: site.g / 15, c: 'var(--amber)' },
    { v: site.th / 10000, c: 'var(--verdant)' },
    { v: site.ts / 100, c: 'var(--steel)' },
    { v: connVal(site.cn) / 10, c: 'var(--mid-blue)' },
    { v: site.p / 3, c: 'var(--amber)' },
  ];

  return (
    <div className="flex gap-[3px] items-end h-[32px]">
      {metrics.map((m, i) => (
        <div key={i} 
          className="w-1 rounded-[2px]"
          style={{
            height: `${clamp(m.v * 100, 8, 100)}%`,
            background: `linear-gradient(180deg, ${m.c}, ${m.c}33)`,
            transition: `height 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s`
          }} 
        />
      ))}
    </div>
  );
};
