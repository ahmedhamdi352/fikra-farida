import Image from 'next/image';
import androidIcon from 'assets/images/android.png';
import iphoneIcon from 'assets/images/apple.png';
import { useTranslations } from 'next-intl';

export default function CompatibleDevices() {
  const t = useTranslations('home')

  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{t('devices.title')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* Android Card */}
          <div className="flex flex-col items-center">
            {/* Icon and Title */}
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 relative">
                <Image
                  src={androidIcon}
                  alt="Android"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">{t('devices.android')}</h3>
            </div>
            {/* Card content */}
            <div className="rounded-[15px] p-4 sm:p-6 lg:p-8 w-full h-full" style={{
              background: 'linear-gradient(110deg, rgba(234, 255, 244, 0.50) 3.18%, rgba(79, 182, 84, 0.50) 83.85%)',
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)'
            }}>
              <p className="text-center text-sm sm:text-base opacity-80">
                {t('devices.descriptionAndroid')}
              </p>
            </div>
          </div>

          {/* iPhone Card */}
          <div className="flex flex-col items-center">
            {/* Icon and Title */}
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 relative">
                <Image
                  src={iphoneIcon}
                  alt="iPhone"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold ">{t('devices.ios')}</h3>
            </div>
            {/* Card content */}
            <div className="rounded-[15px] p-4 sm:p-6 lg:p-8 w-full h-full" style={{
              background: 'linear-gradient(108deg, rgba(217, 217, 217, 0.80) 6.69%, rgba(115, 115, 115, 0.80) 92.26%)',
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)'
            }}>
              <p className="opacity-80 text-center text-sm sm:text-base">
                {t('devices.descriptionIos')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
