import React, { useState, useMemo } from 'react';
import { sites } from '../../data/sites';
import { catIcon, fmt, tierCol } from '../../utils';
import { AnimatedNumber } from '../shared/AnimatedNumber';

interface Props {
  onSelect: (siteId: number) => void;
  onBack: () => void;
}

export const Database: React.FC<Props> = ({ onSelect, onBack }) => {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [sort, setSort] = useState<'h-desc' | 'mw-desc'>('h-desc');

  const states = Array.from(new Set(sites.map(s => s.s))).sort();
  const cats = Array.from(new Set(sites.map(s => s.cat))).sort();

  const filtered = useMemo(() => {
    let res = sites;
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(s => 
        s.n.toLowerCase().includes(q) || 
        s.c.toLowerCase().includes(q) || 
        s.s.toLowerCase().includes(q) || 
        s.o.toLowerCase().includes(q)
      );
    }
    if (filterState !== 'ALL') res = res.filter(s => s.s === filterState);
    if (filterCat !== 'ALL') res = res.filter(s => s.cat === filterCat);
    
    return res.sort((a, b) => {
      if (sort === 'h-desc') return b.h - a.h;
      if (sort === 'mw-desc') return b.mw - a.mw;
      return 0;
    });
  }, [filterState, filterCat, sort]);

  return (
    <div className="min-h-screen bg-[var(--cream)] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[var(--sand)] sticky top-0 z-10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-tertiary)] hover:text-[var(--navy)] transition-colors">
            ← Back
          </button>
          <div className="w-px h-4 bg-[var(--sand)]" />
          <h2 className="text-sm font-bold text-[var(--navy)] uppercase tracking-[1px]">Database Explorer</h2>
        </div>
        
        <div className="flex gap-4 items-center">
          <input 
            type="text" 
            placeholder={`Search ${sites.length} sites by name, city, state, or operator…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-[320px] text-[11px] font-bold text-[var(--navy)] placeholder-[var(--text-tertiary)] bg-[var(--cream)] border border-[var(--sand)] rounded px-4 py-2 outline-none focus:border-[var(--steel)]"
          />

          <select 
            value={filterState} 
            onChange={e => setFilterState(e.target.value)}
            className="text-[11px] font-bold text-[var(--navy)] bg-[var(--warm-white)] border border-[var(--sand)] rounded px-3 py-2 outline-none focus:border-[var(--steel)] cursor-pointer"
          >
            <option value="ALL">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <div className="flex items-center gap-1.5 p-1 bg-[var(--warm-white)] border border-[var(--sand)] rounded-md">
            {['ALL', ...cats].map(c => {
               const count = sites.filter(s => 
                 (c === 'ALL' || s.cat === c) && 
                 (filterState === 'ALL' || s.s === filterState) &&
                 (!search || s.n.toLowerCase().includes(search.toLowerCase()) || s.c.toLowerCase().includes(search.toLowerCase()) || s.s.toLowerCase().includes(search.toLowerCase()) || s.o.toLowerCase().includes(search.toLowerCase()))
               ).length;
               return (
                 <button 
                   key={c}
                   onClick={() => setFilterCat(c)}
                   className={`text-[10px] font-bold uppercase tracking-[1px] px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${filterCat === c ? 'bg-[var(--navy)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--sand)]/30'}`}
                 >
                   {c === 'ALL' ? 'All' : c}
                   <span className={`text-[8px] px-1.5 py-[2px] rounded-full font-bold ${filterCat === c ? 'bg-white/20 text-white' : 'bg-[var(--cream)] border border-[var(--sand)] text-[var(--text-tertiary)]'}`}>{count}</span>
                 </button>
               );
            })}
          </div>

          <select 
            value={sort} 
            onChange={e => setSort(e.target.value as any)}
            className="text-[11px] font-bold text-[var(--navy)] bg-[var(--warm-white)] border border-[var(--sand)] rounded px-3 py-2 outline-none focus:border-[var(--steel)] cursor-pointer"
          >
            <option value="h-desc">Sort: Highest Index</option>
            <option value="mw-desc">Sort: Largest MW</option>
          </select>
        </div>
      </div>

      {/* Grid Header */}
      <div className="max-w-[1200px] mx-auto px-8 mt-8">
        <div className="flex items-end justify-between mb-4 px-4">
          <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--steel)]">
            <AnimatedNumber value={filtered.length} /> Results
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-tertiary)]">
            Displaying by {sort === 'h-desc' ? 'HDV Index' : 'Capacity'}
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {filtered.map(site => (
            <div 
              key={site.id}
              onClick={() => onSelect(site.id)}
              className="bg-white rounded-lg px-4 py-[14px] flex items-center justify-between border border-transparent hover:border-[var(--sand)] hover:shadow-[0_2px_8px_rgba(15,43,76,0.06)] cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4 w-[300px]">
                <div className="w-10 h-10 rounded-full bg-[var(--cream)] flex items-center justify-center text-lg">
                  {catIcon(site.cat)}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[var(--navy)] group-hover:text-[var(--steel)] transition-colors line-clamp-1">
                    {site.n}
                  </div>
                  <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-[1px] mt-0.5">
                    {site.c}, {site.s}
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-4 gap-4 px-8">
                <div>
                  <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[1.5px] mb-1">Tier</div>
                  <div className="text-[11px] font-bold" style={{ color: tierCol(site.t) }}>{site.t || '—'}</div>
                </div>
                <div>
                  <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[1.5px] mb-1">Capacity</div>
                  <div className="text-[11px] font-bold text-[var(--text-secondary)]">{site.cap}</div>
                </div>
                <div>
                  <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[1.5px] mb-1">Deploy MW</div>
                  <div className="text-[11px] font-bold text-[var(--navy)]">{site.mw} MW</div>
                </div>
                <div>
                  <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[1.5px] mb-1">Thermal</div>
                  <div className="text-[11px] font-bold text-[var(--text-secondary)]">{fmt(site.th)} kW</div>
                </div>
              </div>

              <div className="w-[100px] text-right pl-4 border-l border-[var(--sand)]">
                <div className="text-[8px] text-[var(--text-tertiary)] uppercase tracking-[1.5px] mb-0.5">Index Value</div>
                <div className="text-[20px] font-extrabold text-[var(--navy)]">
                  {site.h}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
