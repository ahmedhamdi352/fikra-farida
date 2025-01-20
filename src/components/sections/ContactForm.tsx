import { useTranslations } from 'next-intl';
import Image from 'next/image';
import contactBg from 'assets/images/contactBg.png';
import ContactFormFields from 'components/common/ContactFormFields';

export default function ContactForm() {
  const t = useTranslations('contact');

  return (
    <section className="py-16 relative">
      {/* Background Image with Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src={contactBg}
          alt={t('backgroundAlt')}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 ">
          {/* Text Side - Moved to top */}
          <div className="w-full flex justify-center items-center order-1 sm:order-2  sm:self-center">
            <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:h-[250px] p-4 sm:p-6 lg:p-8
                          bg-[rgba(0,0,0,0.25)] backdrop-blur-[5px]
                          rounded-[15px] border border-[rgba(255,255,255,0.50)]
                          shadow-[4px_4px_20px_0px_rgba(255,255,255,0.25)]">
              <h2 className="leading-normal text-2xl sm:text-3xl lg:text-5xl text-white text-center" style={{ fontFamily: '"Mochiy Pop One", sans-serif' }}>
                {t('title.line1')}
                <span className="block mt-1 sm:mt-2">{t('title.line2')}</span>
                <span className="block text-[#F1911B] mt-1 sm:mt-2">{t('title.line3')}</span>
              </h2>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full order-2 sm:order-1">
            <ContactFormFields />
          </div>
        </div>
      </div>
    </section>
  );
}
