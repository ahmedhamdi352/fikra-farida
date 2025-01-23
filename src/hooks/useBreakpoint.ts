'use client';

import { useState, useEffect } from 'react';

const breakpoints: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type Breakpoints = {
  [key in keyof typeof breakpoints]: boolean;
};

export const useBreakpoint = (): Breakpoints => {
  const getBreakpointMatches = (): Breakpoints => {
    return Object.entries(breakpoints).reduce((acc, [key, value]) => {
      acc[key as keyof Breakpoints] = window.matchMedia(
        key === 'xs' ? `(max-width: ${value - 1}px)` : `(min-width: ${value}px)`
      ).matches;
      return acc;
    }, {} as Breakpoints);
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoints>(getBreakpointMatches());

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpointMatches());
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
};
