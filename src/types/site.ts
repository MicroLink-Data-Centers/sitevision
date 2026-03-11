export interface Site {
  id: number;
  n: string;       // name
  c: string;       // city
  s: string;       // state
  o: string;       // operator
  cap: string;     // capacity (e.g. "1,440 MGD", "12M+ bbl", "R1")
  t: string;       // tier ("Tier A" | "Tier B" | "Tier C")
  mw: number;      // estimated deploy MW
  e: number;       // electricity rate $/kWh
  g: number;       // gas tariff $/MMBtu
  h: number;       // HDV index (0–130)
  ow: string;      // ownership type
  th: number;      // thermal load kW
  ts: number;      // thermal season % (0–100)
  cn: string;      // connectivity ("Excellent" | "Good" | "Fair" | "Limited")
  p: number;       // priority (0–3)
  nt: string;      // notes
  cat: string;     // category ("WWTP" | "BREWERY" | "UNIVERSITY")
  isResearch?: boolean;
}
