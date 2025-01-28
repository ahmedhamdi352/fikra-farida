import { Suspense } from 'react';
import {
  HeroSection,
  FeaturesSection,
  CountryFlags,
  // ContactForm,
  PartnersSection,
  SmartCardSection,
  CompatibleDevices,
  HowItWorksSection,
  // TimeSection
} from 'components';

export default async function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <PartnersSection />
      <SmartCardSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CompatibleDevices />
      {/* <ContactForm /> */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-lg bg-gray-200 h-48 w-96"></div>
              <div className="rounded-lg bg-gray-200 h-48 w-96"></div>
              <div className="rounded-lg bg-gray-200 h-48 w-96"></div>
            </div>
          </div>
        }
      >
      </Suspense>
      <CountryFlags />
    </div>
  );
}