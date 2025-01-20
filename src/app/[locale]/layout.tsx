import "../globals.css";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'components/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { locales, Locale } from '../../i18n';
import { Metadata } from 'next';
import { getSiteData } from '../actions';
import HeaderWrapper from 'components/HeaderWrapper';
import FooterWrapper from 'components/FooterWrapper';

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  return {
    title: {
      template: '%s | Fikra Farida',
      default: 'Fikra Farida 7nksh',
    },
    description: 'Communication between people easily and in the fastest way',
  };
}

export default async function LocaleLayout(props: Props) {
  const { children, params } = props;
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(error);
    notFound();
  }

  // Fetch site data server-side
  const siteData = await getSiteData();

  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <HeaderWrapper initialData={siteData} />
              <main className="flex-1">{children}</main>
              <FooterWrapper initialData={siteData} />
              <ToastContainer
                position={locale === 'ar' ? 'top-left' : 'top-right'}
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={locale === 'ar'}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}