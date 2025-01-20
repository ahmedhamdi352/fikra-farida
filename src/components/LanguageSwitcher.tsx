'use client';

import { useLocale } from 'next-intl';
import { useRouter, } from 'next/navigation';
// import { locales } from '../i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  // const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Since we're not using prefixes, just refresh the page with the new locale
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      onClick={() => switchLocale(locale === 'en' ? 'ar' : 'en')}
      className="hidden lg:block px-3 py-1 bg-gradient-to-tr from-[#F1911B] via-[rgba(254,196,0,0.90)] to-[#F1911B] text-black rounded hover:bg-yellow-500"
    >
      {locale === 'en' ? 'AR' : 'EN'}
    </button>
  );
}
