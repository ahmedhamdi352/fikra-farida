'use client';
import Sub1 from 'assets/images/subcription/sub1.png'
import Sub2 from 'assets/images/subcription/sub2.png'
import Sub3 from 'assets/images/subcription/sub3.png'
import Sub4 from 'assets/images/subcription/sub4.png'
import Sub5 from 'assets/images/subcription/sub5.png'
import Sub6 from 'assets/images/subcription/sub6.png'
import Sub7 from 'assets/images/subcription/sub7.png'
import Sub9 from 'assets/images/subcription/sub9.png'
import { TryNow } from 'components/subcriptions/subcriptionButtons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
const SubscriptionPage = () => {
  const t = useTranslations('subscription');

  const features = [
    {
      title: 'features.createUpToFiveDifferentProfiles',
      description: 'description.createUpToFiveDifferentProfilesDescription',
      image: Sub2
    },
    {
      title: 'features.customizeColorsAndStyle',
      description: 'description.customizeColorsAndStyleDescription',
      image: Sub3
    },
    {
      title: 'features.offlineSharingMode',
      description: 'description.offlineSharingModeDescription',
      image: Sub1
    },
    {
      title: 'features.verifiedAccount',
      description: 'description.verifiedAccountDescription',
      image: Sub5
    },
    {
      title: 'features.exportAndMangeContacts',
      description: 'description.exportAndMangeContactsDescription',
      image: Sub4
    },
    {
      title: 'features.performanceTrackingAndViews',
      description: 'description.performanceTrackingAndViewsDescription',
      image: Sub6
    },
    {
      title: 'features.unlimitedLinks',
      description: 'description.unlimitedLinksDescription',
      image: Sub7
    },
    {
      title: 'features.yourOwnWorkSpace',
      description: 'description.yourOwnWorkSpaceDescription',
      image: Sub9
    },
  ]
  return (
    <div className='flex flex-col gap-4 w-full min-h-screen py-8 px-4 mt-5'>
      {features.map((feature, index) => (
        <div key={index} className='flex flex-col gap-4 text-center text-black rounded-[15px] border border-[#FFF4D3] bg-gradient-to-b from-[rgba(255,244,211,0.7)] to-[rgba(153,146,126,0.7)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-6'>
          <h2 className='text-[20px] font-bold'>{t(feature.title)}</h2>
          <p className='text-[16px]'>{t(feature.description)}</p>
          <Image src={feature.image} alt={feature.title} width={500} height={500} />
        </div>
      ))}
      <TryNow />
    </div>
  );
};

export default SubscriptionPage;
