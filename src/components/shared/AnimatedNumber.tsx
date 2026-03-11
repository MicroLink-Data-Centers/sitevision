import React, { useState, useEffect } from "react";
import { useInView } from "../../hooks/useInView";

interface Props {
  value: number | string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedNumber: React.FC<Props> = ({ value, decimals = 0, prefix = "", suffix = "", className = "" }) => {
  const { ref, inView } = useInView();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
    if (isNaN(num)) {
      setDisplay(value as any);
      return;
    }
    let start = 0;
    const dur = 1200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - p, 3); // cubic ease out
      setDisplay(start + (num - start) * ease);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, inView]);

  const formatted = typeof display === "number" 
    ? `${prefix}${display.toFixed(decimals)}${suffix}` 
    : `${prefix}${display}${suffix}`;

  return <span ref={ref} className={className}>{formatted}</span>;
};
