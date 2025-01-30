'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

const FooterNavigation = () => {
  const t = useTranslations('common');

  return (
    <nav className="space-y-4">
      <Link href="/" className="block hover:text-[#F1911B] transition-colors">
        {t('nav.home')}
      </Link>
      <Link href="/products" className="block hover:text-[#F1911B] transition-colors">
        {t('nav.products')}
      </Link>
      <Link href="/blogs" className="block hover:text-[#F1911B] transition-colors">
        {t('nav.blogs')}
      </Link>
      <Link href="/contact" className="block hover:text-[#F1911B] transition-colors">
        {t('nav.contact')}
      </Link>
    </nav>
  );
};

export default FooterNavigation;
