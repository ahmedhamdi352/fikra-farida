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
import { CartProvider } from 'context/CartContext';
import { AuthProvider } from 'context/AuthContext';
import QueryProvider from 'providers/query-provider';

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const siteConfig = await getSiteData('EG');

  return {
    title: {
      template: `%s | ${siteConfig.name}`,
      default: `${siteConfig.siteName} - Communication between people easily`,
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
  const siteData = await getSiteData('EG');

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <NextIntlClientProvider messages={messages} locale={locale}>
                <CartProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <HeaderWrapper initialData={siteData} />
                    <main className="flex-1 pt-[72px]">{children}</main>
                    <FooterWrapper initialData={siteData} />
                    <ToastContainer
                      position={locale === 'ar' ? 'top-left' : 'top-right'}
                      autoClose={5000}
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
                </CartProvider>
              </NextIntlClientProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}