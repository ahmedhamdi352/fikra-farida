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
import { SiteProvider } from 'context/SiteContext';
import FloatingActionButtons from 'components/FloatingActionButtons';

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  let siteConfig;
  try {
    siteConfig = await getSiteData('EG');
  } catch (error) {
    console.error('Error fetching site data:', error);
    siteConfig = {
      name: 'Fikra Farida',
      description: 'test',
      siteLogo: '',
      siteIcon: '',
      email: '',
      phone: '',
      address: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      whatsapp: '',
    };
  }

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

  let siteData;
  try {
    siteData = await getSiteData('EG');
  } catch (error) {
    console.error('Error fetching site data:', error);
    siteData = {
      name: 'Fikra Farida',
      code: 'EG',
      domain: 'fikrafarida.com',
      currency: 'EGP',
      siteLogo: '',
      siteName: 'Fikra Farida',
      contactLocation: '',
      contactEmail: '',
      contactPhone: '',
      contactFacebook: '',
      contactWhatsapp: '',
      contactTiktok: '',
      contactInstagram: '',
      contactX: null,
      contactSnapchat: null,
      connectUser1: null,
      connectUser2: null,
      reviewMedia1: null,
      reviewMedia2: null,
      reviewMedia3: null,
      reviewMedia4: null,
      reviewMedia5: null,
      siteNews: null,
      updateDate: new Date().toISOString()
    };
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <NextIntlClientProvider messages={messages} locale={locale}>
                <CartProvider>
                  <SiteProvider initialData={siteData}>
                    <div className="relative flex min-h-screen flex-col">
                      <HeaderWrapper initialData={siteData} />
                      <main className="flex-1 pt-[72px]">{children}</main>
                      <FooterWrapper initialData={siteData} />
                      <FloatingActionButtons 
                        whatsappNumber={siteData.contactWhatsapp}
                        phoneNumber={siteData.contactPhone}
                        email={siteData.contactEmail}
                      />
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
                  </SiteProvider>
                </CartProvider>
              </NextIntlClientProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}