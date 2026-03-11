import { useState } from 'react';
import { Landing } from './components/landing/Landing';
import { Database } from './components/database/Database';
import { SiteProfile } from './components/profile/SiteProfile';
import { ResearchInput } from './components/profile/ResearchInput';
import type { Site } from './types/site';
import './index.css';

type ViewState = 'landing' | 'db' | 'research' | 'profile';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [siteId, setSiteId] = useState<number | null>(null);
  const [researchSite, setResearchSite] = useState<Site | null>(null);

  const nav = (v: ViewState, id?: number) => {
    setView(v);
    if (id) setSiteId(id);
  };

  if (view === 'landing') return <Landing onNav={nav} />;
  if (view === 'db') return <Database onBack={() => nav('landing')} onSelect={(id) => nav('profile', id)} />;
  if (view === 'research') return (
    <ResearchInput 
      onSubmit={(site) => { setResearchSite(site); nav('profile', 9999); }} 
      onBack={() => nav('landing')} 
    />
  );

  if (view === 'profile' && siteId) {
    if (siteId === 9999 && researchSite) {
      return <SiteProfile siteId={9999} siteOverride={researchSite} onBack={() => nav('research')} />;
    }
    return <SiteProfile siteId={siteId} onBack={() => nav('db')} />;
  }

  return null;
}

export default App;
