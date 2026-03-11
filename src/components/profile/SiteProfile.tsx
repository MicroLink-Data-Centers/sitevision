import { useEffect } from 'react';
import { catIcon, fmt, tierCol, connVal } from '../../utils';
import { Card, SectionHead } from '../shared/LayoutComponents';
import { MetricBig } from '../shared/MetricBig';
import { SiteDNA } from '../shared/SiteDNA';
import { SpectrumDotScale } from '../shared/SpectrumDotScale';
import { HalfArcGauge } from '../shared/HalfArcGauge';
import { SankeyFlow } from '../shared/SankeyFlow';
import { GradientBar } from '../shared/GradientBar';
import { PeerConstellation } from '../shared/PeerConstellation';
import { AnimatedNumber } from '../shared/AnimatedNumber';
import { FadeInSection } from '../shared/FadeInSection';
import { sites } from '../../data/sites';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import type { Site } from '../../types/site';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  siteId: number;
  siteOverride?: Site;
  onBack: () => void;
}

export const SiteProfile: React.FC<Props> = ({ siteId, siteOverride, onBack }) => {
  const site = siteOverride || sites.find(s => s.id === siteId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!site) return null;

  const handleExport = async () => {
    const el = document.getElementById('profile-content');
    if (!el) return;
    
    // Temporarily hide UI elements for clean capture
    const uiElements = document.querySelectorAll('.no-export');
    uiElements.forEach(el => (el as HTMLElement).style.display = 'none');
    el.classList.remove('animate-fade-in');
    
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#F5F0E8', // var(--cream)
      logging: false, // Clean up console
      onclone: (clonedDoc) => {
        // Ensure SVGs render cleanly in html2canvas
        const svgs = Array.from(clonedDoc.querySelectorAll('svg'));
        svgs.forEach(svg => {
          svg.setAttribute('width', svg.getBoundingClientRect().width.toString());
          svg.setAttribute('height', svg.getBoundingClientRect().height.toString());
          svg.style.width = svg.getBoundingClientRect().width + 'px';
          svg.style.height = svg.getBoundingClientRect().height + 'px';
        });
      }
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${site.n.replace(/\s+/g, '_')}_Profile.pdf`);
    el.classList.add('animate-fade-in');
    uiElements.forEach(el => (el as HTMLElement).style.display = '');
  };

  // Radar Data
  const radarData = [
    { subject: 'Power', A: (site.p / 3) * 100, fullMark: 100 },
    { subject: 'Thermal', A: (site.th / 60000) * 100, fullMark: 100 },
    { subject: 'Deploy', A: (site.mw / 40) * 100, fullMark: 100 },
    { subject: 'Connect', A: (connVal(site.cn) / 10) * 100, fullMark: 100 },
    { subject: 'Season', A: site.ts, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[var(--cream)] pb-24 font-sans">
      {/* Top Nav */}
      <div className="no-export bg-[var(--warm-white)] border-b border-[var(--sand)] sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-tertiary)] hover:text-[var(--navy)] transition-colors">
          ← Back to Database
        </button>
        <div className="text-[11px] uppercase tracking-[2px] font-bold text-[var(--navy)]">SITE PROFILE</div>
        <button 
          onClick={handleExport} 
          className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-tertiary)] hover:text-[var(--navy)] transition-colors flex items-center gap-1.5 group"
        >
          Export PDF <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <div id="profile-content" className="max-w-[920px] mx-auto px-6 mt-12 animate-fade-in bg-[var(--cream)] pb-12">
        {site.isResearch && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-4 py-2 rounded flex items-center gap-2">
            ⚠️ State Defaults Applied (EIA estimates based on Region)
          </div>
        )}

        {/* 01 Hero Identity */}
        <FadeInSection>
        <SectionHead title="Hero Identity" num="01" />
        <div className="flex justify-between items-end mb-12">
          <div className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl border border-[var(--sand)]">
              {catIcon(site.cat)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[34px] font-extrabold text-[var(--navy)] leading-tight tracking-tight">{site.n}</h1>
              </div>
              <div className="text-[13px] text-[var(--text-secondary)] font-medium tracking-wide uppercase">
                {site.c}, {site.s} <span className="mx-2 text-[var(--sand)]">|</span> {site.o}
              </div>
            </div>
          </div>
          <div className="w-[180px] flex flex-col items-end">
            <div className="flex items-center gap-3 mb-2 relative">
              <div className="text-[9px] uppercase tracking-[2px] text-[var(--text-tertiary)] font-bold">Classification</div>
              <div 
                className="absolute right-[-10px] w-10 h-10 rounded-full blur-[6px] opacity-50 z-0"
                style={{ backgroundColor: tierCol(site.t) }}
              />
              <div 
                className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center relative z-10"
                style={{ backgroundColor: tierCol(site.t) }}
              >
                {site.t.charAt(site.t.length - 1)}
              </div>
            </div>
            <div className="text-[9px] uppercase tracking-[2px] text-[var(--text-tertiary)] mb-2 mt-4 font-bold relative z-10">Site DNA</div>
            <div className="relative z-10"><SiteDNA site={site} /></div>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="w-full h-[120px] mb-12 border-2 border-[var(--sand)] rounded-xl flex flex-col items-center justify-center bg-[var(--warm-white)]/50">
          <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-[1.5px] font-bold mb-1">Location Map</span>
          <span className="text-[10px] text-[var(--text-secondary)] italic">Requires Geocoding API</span>
        </div>
        </FadeInSection>

        {/* 02 Key Metrics */}
        <FadeInSection>
        <SectionHead title="Key Metrics" num="02" />
        <div className="grid grid-cols-4 gap-[10px] mb-[22px]">
          <Card className="text-center group">
            <MetricBig value={site.mw} unit="MW" label="Deploy MW" color="var(--navy)" />
          </Card>
          <Card className="text-center border-b-4 border-[var(--steel)]">
            <MetricBig value={site.h} label="HDV Index" color="var(--steel)" />
          </Card>
          <Card className="text-center">
            <MetricBig value={fmt(site.e)} unit="/ kWh" label="Electricity Rate" color="var(--text-secondary)" decimals={2} />
          </Card>
          <Card className="text-center">
            <MetricBig value={fmt(site.g)} unit="/ MMBtu" label="Gas Tariff" color="var(--text-secondary)" decimals={2} />
          </Card>
        </div>
        </FadeInSection>

        {/* 03 Power & Energy */}
        <FadeInSection>
        <SectionHead title="Power & Energy" num="03" />
        <Card className="mb-[22px] relative overflow-hidden pb-8">
          <div className="grid grid-cols-[1fr,2fr] gap-[10px] mb-8 relative z-10">
            <div className="flex flex-col gap-6 justify-center pl-4">
              <GradientBar label="Grid Draw" value={site.mw * 1000} max={50000} unit="kW" color="var(--navy)" />
              <GradientBar label="Thermal Exchange" value={site.th} max={60000} unit="kW" color="var(--amber)" />
              <GradientBar label="Efficiency Gain" value={(site.th * 0.4)} max={30000} unit="kW" color="var(--verdant)" />
            </div>
            <div className="h-[240px] pt-4 pr-4">
               <SankeyFlow site={site} />
            </div>
          </div>
        </Card>
        </FadeInSection>

        {/* 04 Position Assessment */}
        <FadeInSection>
        <SectionHead title="Position Assessment" num="04" />
        <Card className="mb-[22px] flex flex-col gap-8">
          <SpectrumDotScale 
            label="Thermal Profile" 
            value={site.ts} 
            max={100}
            leftLabel="Seasonal" 
            rightLabel="Year-Round" 
          />
          <SpectrumDotScale 
            label="Connectivity" 
            value={(connVal(site.cn) / 10) * 100} 
            max={100}
            leftLabel="Limited" 
            rightLabel="Excellent" 
          />
          <SpectrumDotScale 
            label="Market Position" 
            value={(site.h / 130) * 100}
            max={100} 
            leftLabel="Emerging" 
            rightLabel="Established" 
          />
        </Card>
        </FadeInSection>

        {/* 05 Multi-Dimensional Analysis */}
        <FadeInSection>
        <SectionHead title="Multi-Dimensional Analysis" num="05" />
        <div className="grid grid-cols-2 gap-[10px] mb-[22px]">
          <Card className="flex flex-col items-center justify-center relative min-h-[300px] pt-6 pb-2">
            <div className="text-center z-10 mb-4">
              <div className="text-[52px] font-extrabold text-[var(--navy)] leading-none"><AnimatedNumber value={site.h} /></div>
              <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[2px] mt-1 font-bold">Total Score</div>
            </div>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--sand)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} />
                  <Radar name="Site" dataKey="A" stroke="var(--steel)" fill="var(--ice)" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="grid grid-cols-2 grid-rows-2 gap-6 items-center justify-items-center">
            <HalfArcGauge value={site.mw} max={50} label="Power Capacity" unit="MW" color="var(--navy)" size={130} />
            <HalfArcGauge value={site.ts} max={100} label="Year-Round Match" unit="%" color="var(--steel)" size={130} />
            <HalfArcGauge value={site.th} max={60000} label="Thermal Load" unit="kW" color="var(--amber)" size={130} />
            <HalfArcGauge value={connVal(site.cn) * 10} max={100} label="Connectivity" unit="/100" color="var(--verdant)" size={130} />
          </Card>
        </div>
        </FadeInSection>

        {/* 06 Financial Estimate */}
        <FadeInSection>
        <SectionHead title="Financial Estimate" num="06" />
        <div className="grid grid-cols-4 gap-[10px] mb-[22px]">
          {/* CapEx ($12M/MW), Revenue ($170/kW/month), EBITDA (50% margin annually) */}
          <Card className="text-center">
            <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[2px] mb-2 font-bold">Est. CapEx</div>
            <div className="text-[28px] font-extrabold text-[var(--navy)]">${fmt(site.mw * 12)}M</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">@ $12M/MW × {site.mw} MW</div>
          </Card>
          <Card className="text-center">
            <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[2px] mb-2 font-bold">Annual Revenue</div>
            <div className="text-[28px] font-extrabold text-[var(--navy)]">${fmt(Math.round(site.mw * 1000 * 170 * 12 / 100000) / 10)}M</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">$170 / kW / mo</div>
          </Card>
          <Card className="text-center">
            <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[2px] mb-2 font-bold">EBITDA</div>
            <div className="text-[28px] font-extrabold text-[var(--verdant)]">${fmt(Math.round(site.mw * 1000 * 170 * 12 * 0.5 / 100000) / 10)}M</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">Target Margin: 50% ($M/yr)</div>
          </Card>
          <Card className="text-center">
            <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[2px] mb-2 font-bold">Est. Payback</div>
            <div className="text-[28px] font-extrabold text-[var(--navy)]">~{Math.round((site.mw * 12) / ((site.mw * 1000 * 170 * 12 * 0.5) / 1000000))}</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-1">Years</div>
          </Card>
        </div>
        </FadeInSection>

        {/* 07 Peer Landscape */}
        <FadeInSection>
        <SectionHead title="Peer Landscape" num="07" />
        <div className="grid grid-cols-2 gap-[10px] mb-[22px]">
          <Card className="min-h-[300px]">
             <div className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-[1px] mb-4">Thermal / HDV Scatter</div>
             <PeerConstellation site={site} peers={sites.filter(s => s.cat === site.cat && s.id !== site.id).slice(0, 10)} />
          </Card>
          <Card className="min-h-[300px]">
             <div className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-[1px] mb-4">HDV Distribution</div>
             <div className="w-full h-[240px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[site, ...sites.filter(s => s.cat === site.cat && s.id !== site.id).slice(0, 10)].sort((a,b)=>a.h-b.h).map((s) => ({ name: s.n.substring(0, 10), index: s.h }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorHdv" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--steel)" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="var(--steel)" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={{ stroke: 'var(--sand)' }} />
                   <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
                   <Tooltip contentStyle={{ backgroundColor: 'var(--warm-white)', border: '1px solid var(--sand)', borderRadius: '8px', fontSize: '10px', color: 'var(--navy)' }} />
                   <Area type="monotone" dataKey="index" stroke="var(--steel)" fillOpacity={1} fill="url(#colorHdv)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </Card>
        </div>
        </FadeInSection>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[var(--sand)] text-center pb-8">
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-tertiary)] mb-2">
            MicroLink Data Centers <span className="mx-2">·</span> SiteVision <span className="mx-2">·</span> Generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {site.isResearch ? (
            <div className="text-[10px] text-amber-600 font-bold uppercase tracking-[1px]">
               Preliminary Assessment <span className="mx-2">·</span> Full Tier 2 evaluation required for investment-grade analysis
            </div>
          ) : (
            <div className="text-[10px] text-[var(--text-tertiary)] italic">
              Source: MicroLink Prospecting Database v1.0
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
