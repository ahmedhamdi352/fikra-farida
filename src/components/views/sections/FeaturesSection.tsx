'use client';

// import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import security from 'assets/images/security.png';
import environment from 'assets/images/environment.png';
import premium from 'assets/images/premium.png';


export default function FeaturesSection() {
  // const t = useTranslations('home.features');
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      icon: premium,
      title: 'Premium Experiment',
      description: [
        'Advanced tool No need to bother in case of changing the phone number or email or losing any of your information, you can easily update it.',
        'It works with iPhone or Android even with older versions you can use QR code scanning.',
        'With one swipe you can share all your information, phone numbers, Social Media, important files, even your custom links and more.',
        'Flexible, You don\'t need an app and Other people do not need to have the App or have access to our products in order to share your information with them.',
        'The ability to add one link and direct people to it.'
      ]
    },
    {
      icon: security,
      title: 'Secure Information',
      description: [
        'End-to-end encryption for all your data',
        'Secure storage of personal information',
        'Two-factor authentication available',
        'Regular security audits and updates',
        'Complete control over data sharing'
      ]
    },
    {
      icon: environment,
      title: 'Environment Saving',
      description: [
        'Reduces paper waste from traditional business cards',
        'Eco-friendly digital solution',
        'Promotes sustainable networking practices',
        'Minimizes carbon footprint',
        'Supports green initiative'
      ]
    }
  ];

  return (
    <section className="py-8 text-[#FEC400]">
      <div className="container mx-auto px-4">
        <h2 className="whitespace-nowrap text-[12px] sm:text-[24px] md:text-[36px] lg:text-[48px] font-normal text-center mb-12 relative flex items-center justify-center gap-2 lg:gap-4">
          <span className="inline-block border-t border-[#FEC400] w-8 sm:w-12 lg:w-16"></span>
          Special <span className="text-[#FEC400] text-[16px] sm:text-[32px] md:text-[48px] lg:text-[64px] font-bold">Features</span> To Grow Faster
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
              <li key={index} className="flex items-start">
                <span className="text-[#FEC400] mr-3 text-lg">•</span>
                <p className="text-gray-300">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
