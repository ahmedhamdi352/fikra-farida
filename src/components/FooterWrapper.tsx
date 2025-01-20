'use client';

import { useState, useEffect } from 'react';
import { SiteData } from 'services/api.service';
import Footer from './Footer';

interface FooterWrapperProps {
  initialData: SiteData;
}

export default function FooterWrapper({ initialData }: FooterWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Footer siteData={initialData} />;
}
