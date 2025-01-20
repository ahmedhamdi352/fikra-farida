
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import ContactFormFields from 'components/common/ContactFormFields';

export const metadata: Metadata = {
  title: 'Contact Us | Fikra Farida',
  description: 'Get in touch with our team at Fikra Farida. We\'re here to help you with any questions or concerns.',
};

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="min-h-screen py-16">
      {/* Header Section */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="text-white">{t('header.title.part1')} </span>
          <span className="text-[#F1911B]">{t('header.title.part2')}</span>
        </h1>
        <p className="text-white/80 text-lg">
          {t('header.subtitle')}
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-yellow-500/20 p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Side */}
            <div>
              <h2 className="text-2xl text-white font-semibold mb-8">{t('title.line1')}</h2>
              <ContactFormFields />
            </div>

            {/* Info Side */}
            <div className="lg:pl-12 flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-[#F1911B] text-xl font-semibold mb-4">
                  {t('info.title')}
                </h3>
                <p className="text-white/80">
                  {t('info.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-[#F1911B]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">{t('info.phone.label')}</div>
                    <div className="text-white">{t('info.phone.value')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-[#F1911B]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">{t('info.email.label')}</div>
                    <div className="text-white">{t('info.email.value')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-[#F1911B]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">{t('info.location.label')}</div>
                    <div className="text-white">{t('info.location.value')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
