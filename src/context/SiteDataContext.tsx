'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useApi } from 'hooks/useApi';
import { SiteData, siteApi } from 'services/api.service';

interface SiteDataContextType {
  siteData: SiteData | undefined;
  isLoading: boolean;
  error: string | null;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const { execute: fetchSiteData, data: siteData, isLoading, error } = useApi<SiteData>();

  useEffect(() => {
    const getSiteData = async () => {
      await fetchSiteData(() => siteApi.getSiteData('EG', 'fikrafarida.com'));
    };
    getSiteData();
  }, [fetchSiteData]);

  return (
    <SiteDataContext.Provider value={{ siteData, isLoading, error }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
