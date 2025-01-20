import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Specify all supported locales here
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const headersList = headers();
  const locale = (await headersList).get('X-NEXT-INTL-LOCALE') || defaultLocale;

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale: locale,
    timeZone: 'Asia/Dubai',
    now: new Date(),
  };
});
