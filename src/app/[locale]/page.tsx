import { Suspense } from 'react';
import HeroSection from 'components/sections/HeroSection';
import FeaturesSection from 'components/sections/FeaturesSection';
// import ProductCards from 'components/sections/ProductCards';
import CountryFlags from 'components/sections/CountryFlags';
import ContactForm from 'components/sections/ContactForm';
import PartnersSection from 'components/sections/PartnersSection';
import SmartCardSection from 'components/sections/SmartCardSection';
import CompatibleDevices from 'components/sections/CompatibleDevices';
import HowItWorksSection from 'components/sections/HowItWorksSection';
import TimeSection from 'components/sections/TimeSection';

// Mark page as Server Component
export default async function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Static SSR Components */}
      <HeroSection />
      <PartnersSection />
      <SmartCardSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TimeSection />
      <CompatibleDevices />
      <ContactForm />
      {/* Client-side Product Cards with loading state */}
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
        {/* <ProductCards /> */}
      </Suspense>

      {/* Country Flags Section */}
      <CountryFlags />
    </div>
  );
}