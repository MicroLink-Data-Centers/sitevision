import React from 'react';
import { useInView } from '../../hooks/useInView';

export const FadeInSection: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { ref, inView } = useInView();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {children}
    </div>
  );
};
