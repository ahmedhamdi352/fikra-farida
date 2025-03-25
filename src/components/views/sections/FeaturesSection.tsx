'use client';

// import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import security from 'assets/images/security.png';
import environment from 'assets/images/environment.png';
import premium from 'assets/images/premium.png';
import { useTranslations } from 'next-intl';


export default function FeaturesSection() {
  const t = useTranslations('home');
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      icon: premium,
      title: t('features.premium'),
      description: [
        t('features.premium1'),
        t('features.premium2'),
        t('features.premium3'),
        t('features.premium4'),
        t('features.premium5')
      ]
    },
    {
      icon: security,
      title: t('features.secure'),
      description: [
        t('features.secure1'),
        t('features.secure2'),
      ]
    },
    {
      icon: environment,
      title: t('features.environmentSaving'),
      description: [
        t('features.environmentSaving1'),
        t('features.environmentSaving2')
      ]
    }
  ];

  return (
    <section className="py-8 text-[#FEC400]">
      <div className="container mx-auto px-4">
        <h2 className=" text-h3 whitespace-nowrap font-normal text-center mb-12 relative flex items-center justify-center gap-2 lg:gap-4">
          <span className="inline-block border-t border-[#FEC400] w-8 sm:w-12 lg:w-16"></span>
          {t('features.special')}
          <span className="text-[#FEC400] text-h2 font-bold">
            {t('features.features')}
          </span>
          {t('features.grow')}
          <span className="inline-block border-t border-[#FEC400] w-8 sm:w-12 lg:w-16"></span>
        </h2>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-3 sm:p-4 lg:p-6 rounded-[15px] transition-all duration-300 cursor-pointer border border-white border-opacity-50
                ${selectedFeature === index
                  ? 'bg-[rgba(244,221,148,0.25)] shadow-[4px_4px_4px_0px_rgba(254,196,0,0.25)] backdrop-blur-[25px]'
                  : 'bg-[rgba(44,44,44,0.4)] hover:bg-[rgba(44,44,44,0.6)]'}`}
              onClick={() => setSelectedFeature(index)}
            >
              <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 drop-shadow-lg"
                />
              </div>
              <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-center mb-2">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="bg-[rgba(244,221,148,0.25)] shadow-[4px_4px_4px_0px_rgba(254,196,0,0.25)] backdrop-blur-[25px] p-8 rounded-[15px] border border-white border-opacity-50">
          <ul className="space-y-4">
            {features[selectedFeature].description.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[#FEC400] text-lg">•</span>
                <p className="dark:text-gray-300 text-gray-600">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
