'use client';

import { useTranslations } from 'next-intl';

export default function ProductsHeader() {
  const t = useTranslations('home');

  return (
    <>
      <h2 className="text-h2 font-bold text-center mb-12">
        {t('products.headTitle')} <span className="text-yellow-500">{t('products.special')}</span> {t('products.with')}
        <p className="font-bold text-h1">{t('products.ourProducts')}</p>
      </h2>


    </>
  );
}
