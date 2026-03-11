import React from 'react';

interface Props {
  onNav: (view: 'db' | 'research') => void;
}

export const Landing: React.FC<Props> = ({ onNav }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--cream)]">
      <div className="max-w-[720px] w-full text-center">
        <h1 className="text-[64px] font-extrabold font-sans leading-[1.1] text-[var(--navy)] mb-6 tracking-tight">
          SiteVision<span className="text-[var(--steel)]">.</span>
        </h1>
        <p className="text-[18px] text-[var(--text-secondary)] leading-relaxed mb-16 max-w-[540px] mx-auto font-medium">
          Visual intelligence and benchmarking for industrial host facilities. Evaluated across thermal load parameters, fiber connectivity, and energy economics.
        </p>

        <div className="flex gap-6 justify-center">
          <button 
            onClick={() => onNav('db')}
            className="w-[240px] bg-[var(--navy)] text-white py-4 px-6 rounded-md font-bold uppercase tracking-[1.5px] text-[11px] hover:bg-[var(--steel)] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
          >
            Database Explorer
            <span className="block text-[9px] font-normal text-white/60 mt-1 lowercase tracking-normal font-mono">170 facilities parsed</span>
          </button>
          
          <button 
            onClick={() => onNav('research')}
            className="w-[240px] bg-white border border-[var(--sand)] text-[var(--navy)] py-4 px-6 rounded-md font-bold uppercase tracking-[1.5px] text-[11px] hover:border-[var(--steel)] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200"
          >
            Research New Site
            <span className="block text-[9px] font-normal text-[var(--text-tertiary)] mt-1 lowercase tracking-normal font-mono">Input parameters</span>
          </button>
        </div>
        
        <div className="mt-24 text-[10px] text-[var(--text-tertiary)] uppercase tracking-[2px] font-bold">
          MicroLink Data Centers
        </div>
      </div>
    </div>
  );
};
