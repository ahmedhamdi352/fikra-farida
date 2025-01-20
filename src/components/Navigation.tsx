'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Navigation() {
  const t = useTranslations('common.nav');
  const pathname = usePathname();
  const { locale } = useParams();

  const isActive = (path: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    return currentPath === path;
  };

  const getPath = (path: string) => `/${locale}${path}`;

  return (
    <nav className="mb-8">
      <ul className="flex gap-6">
        <li>
          <Link
            href={getPath('/')}
            className={`transition-colors ${isActive('/')
                ? 'text-blue-600 dark:text-blue-400'
                : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
          >
            {t('home')}
          </Link>
        </li>
        <li>
          <Link
            href={getPath('/about')}
            className={`transition-colors ${isActive('/about')
                ? 'text-blue-600 dark:text-blue-400'
                : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
          >
            {t('about')}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
