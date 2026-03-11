import { useState } from 'react';
import type { Site } from '../../types/site';

interface Props {
  onSubmit: (site: Site) => void;
  onBack: () => void;
}

const CAT_DEFAULTS: Record<string, Partial<Site>> = {
  WWTP: { cap: '15 MGD', t: 'Tier B', mw: 5, h: 80, th: 10000, ts: 80, cn: 'Good', p: 1 },
  BREWERY: { cap: '2M bbl', t: 'Tier B', mw: 8, h: 90, th: 15000, ts: 60, cn: 'Fair', p: 2 },
  UNIVERSITY: { cap: 'Campus', t: 'Tier A', mw: 12, h: 100, th: 20000, ts: 50, cn: 'Excellent', p: 3 },
};

const STATE_DEFAULTS: Record<string, { e: number; g: number }> = {
  CA: { e: 0.16, g: 9.8 },
  TX: { e: 0.08, g: 5.5 },
  NY: { e: 0.15, g: 8.2 },
  IL: { e: 0.10, g: 6.5 },
  FL: { e: 0.11, g: 7.0 },
  MA: { e: 0.18, g: 11.5 },
  DEFAULT: { e: 0.12, g: 7.5 },
};

export const ResearchInput: React.FC<Props> = ({ onSubmit, onBack }) => {
  const [n, setN] = useState('');
  const [c, setC] = useState('');
  const [s, setS] = useState('');
  const [cat, setCat] = useState('WWTP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = s.toUpperCase();
    const stateDefaults = STATE_DEFAULTS[st] || STATE_DEFAULTS.DEFAULT;
    const catDefaults = CAT_DEFAULTS[cat];

    const newSite: Site = {
      id: Date.now(),
      n: n || 'Unknown Facility',
      c: c || 'Unknown City',
      s: st || 'US',
      o: 'Private / Municipal',
      cap: catDefaults.cap as string,
      t: catDefaults.t as string,
      mw: catDefaults.mw as number,
      e: stateDefaults.e,
      g: stateDefaults.g,
      h: catDefaults.h as number,
      ow: cat === 'UNIVERSITY' ? 'University' : cat === 'WWTP' ? 'Municipal' : 'Private',
      th: catDefaults.th as number,
      ts: catDefaults.ts as number,
      cn: catDefaults.cn as string,
      p: catDefaults.p as number,
      nt: 'Auto-generated research estimate based on state and category averages.',
      cat,
      isResearch: true,
    };

    onSubmit(newSite);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-8">
      <div className="max-w-[500px] w-full bg-white p-10 rounded-xl shadow-lg border border-[var(--sand)]">
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-2">Research New Site</h2>
        <p className="text-[12px] text-[var(--text-secondary)] mb-8">
          Input top-level parameters to generate an EIA-estimated site profile.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-[1.5px] mb-2">Facility Name</label>
            <input 
              required
              value={n} onChange={e => setN(e.target.value)}
              className="w-full bg-[var(--warm-white)] border border-[var(--sand)] rounded h-11 px-4 text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--steel)]"
              placeholder="e.g. Phoenix Water Reclamation"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-[1.5px] mb-2">City</label>
              <input 
                required
                value={c} onChange={e => setC(e.target.value)}
                className="w-full bg-[var(--warm-white)] border border-[var(--sand)] rounded h-11 px-4 text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--steel)]"
                placeholder="Phoenix"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-[1.5px] mb-2">State</label>
              <input 
                required
                maxLength={2}
                value={s} onChange={e => setS(e.target.value.toUpperCase())}
                className="w-full bg-[var(--warm-white)] border border-[var(--sand)] rounded h-11 px-4 text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--steel)]"
                placeholder="AZ"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-[1.5px] mb-2">Category Type</label>
            <select 
              value={cat} onChange={e => setCat(e.target.value)}
              className="w-full bg-[var(--warm-white)] border border-[var(--sand)] rounded h-11 px-4 text-[13px] font-bold text-[var(--navy)] outline-none focus:border-[var(--steel)]"
            >
              <option value="WWTP">Wastewater Treatment Plant</option>
              <option value="BREWERY">Brewery / Food & Bev</option>
              <option value="UNIVERSITY">University Campus</option>
            </select>
          </div>

          <div className="mt-4 flex gap-4">
            <button type="button" onClick={onBack} className="flex-1 border border-[var(--sand)] text-[var(--text-secondary)] font-bold text-[11px] uppercase tracking-[1.5px] rounded h-12 hover:bg-[var(--warm-white)] transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-[var(--steel)] text-white font-bold text-[11px] uppercase tracking-[1.5px] rounded h-12 hover:bg-[var(--navy)] transition">
              Simulate Output
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
