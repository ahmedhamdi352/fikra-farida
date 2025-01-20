'use client';

import { useState, useEffect } from 'react';
import { SiteData } from 'services/api.service';
import Header from './Header';

interface HeaderWrapperProps {
  initialData: SiteData;
}

export default function HeaderWrapper({ initialData }: HeaderWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Header siteData={initialData} />;
}
