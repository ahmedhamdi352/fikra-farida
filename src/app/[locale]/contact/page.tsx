
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ContactFormFields, ContactInfo } from 'components';

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
          <span >{t('header.title.part1')} </span>
          <span className="text-[var(--main-color1)]">{t('header.title.part2')}</span>
        </h1>
        <p className=" text-lg font-semibold">
          {t('header.subtitle')}
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="card-container p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Side */}
            <div>
              <h2 className="text-2xl  font-semibold mb-8">{t('title.line1')}</h2>
              <ContactFormFields />
            </div>

            {/* Info Side */}
            <ContactInfo />

          </div>
        </div>
      </div>
    </div>
  );
}
