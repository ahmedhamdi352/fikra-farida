'use client';

import React, { createContext, useContext } from 'react';

interface SiteData {
  name: string;
  code: string;
  domain: string;
  currency: string;
  siteLogo: string;
  siteName: string;
  contactLocation: string;
  contactEmail: string;
  contactPhone: string;
  contactFacebook: string;
  contactWhatsapp: string;
  contactTiktok: string;
  contactInstagram: string;
  contactX: string | null;
  contactSnapchat: string | null;
  connectUser1: string | null;
  connectUser2: string | null;
  reviewMedia1: string | null;
  reviewMedia2: string | null;
  reviewMedia3: string | null;
  reviewMedia4: string | null;
  reviewMedia5: string | null;
  siteNews: string | null;
  updateDate: string;
}

const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({ children, initialData }: { children: React.ReactNode; initialData: SiteData }) {
  return <SiteContext.Provider value={initialData}>{children}</SiteContext.Provider>;
}

export function useSiteData() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
}
