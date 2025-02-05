
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ContactFormFields from 'components/common/ContactFormFields';
import phoneIcon from 'assets/icons/phone.svg'
import pinIcon from 'assets/icons/pin.svg'
import emailIcon from 'assets/icons/mail.svg'

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
          <span className="text-[var(--main-color1)]">{t('header.title.part2')}</span>
        </h1>
        <p className="text-white/80 text-lg font-semibold">
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
            <div className="hidden lg:pl-12 lg:flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-[var(--main-color1)] text-xl font-semibold mb-4">
                  {t('info.title')}
                </h3>
                <p className="text-white/80">
                  {t('info.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-start justify-start gap-4">
                  <div className="text-[var(--main-color1)]">
                    <a
                      href={`tel:${t('info.phone.value')}`}
                      className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[200px] overflow-hidden text-ellipsis"
                    >
                      <Image src={phoneIcon} alt="Phone" width={30} height={30} />
                      <div>
                        <p className="text-white font-bold text-[20px]">
                          {t('info.phone.label')}
                        </p>
                        <span className="truncate text-[16px]">{t('info.phone.value')}</span>
                      </div>
                    </a>
                  </div>

                  <div className="text-[var(--main-color1)]">
                    <a
                      href={`mailto:${t('info.email.value')}`}
                      className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[200px] overflow-hidden text-ellipsis"
                    >
                      <Image src={emailIcon} alt="Phone" width={60} height={60} />
                      <div>
                        <p className="text-white font-bold text-[20px]">
                          {t('info.email.label')}
                        </p>
                        <span className="truncate text-[16px]">{t('info.email.value')}</span>
                      </div>
                    </a>
                  </div>

                  <div
                    className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[200px] overflow-hidden text-ellipsis"
                  >
                    <Image src={pinIcon} alt="Phone" width={30} height={30} />
                    <div>
                      <span className="truncate text-[var(--main-color1)] font-bold text-[16px]">{t('info.location.value')}</span>
                    </div>
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
