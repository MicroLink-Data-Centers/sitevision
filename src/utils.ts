export const tierCol = (t?: string) => t?.includes("A") ? "var(--verdant)" : t?.includes("B") ? "var(--steel)" : "var(--amber)";

export const catIcon = (c: string) => c === "WWTP" ? "💧" : c === "BREWERY" ? "🍺" : "🎓";
export const catLabel = (c: string) => c === "WWTP" ? "Wastewater Treatment Plant" : c === "BREWERY" ? "Brewery" : "University";

export const fmt = (v: number | string) => typeof v === "number" ? v.toLocaleString() : v;

export const connVal = (c: string) => c === "Excellent" ? 10 : c === "Good" ? 7 : c === "Fair" ? 4 : 2;

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
