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
const SubscriptionPage = () => {

  const features = [
    {
      title: 'Create up to 5 Different Profiles',
      description: 'create uniqe digital business cards for eny occasion and instanly switch between them at ant time',
      image: Sub2
    },
    {
      title: 'Customize Colors and Style',
      description: 'Choose your favorite colors and pick from 3 display styles to match your brand or personality.',
      image: Sub3
    },
    {
      title: 'offline sharing mode',
      description: 'Let others access your info even if they don’t have internet – anytime, anywhere.',
      image: Sub1
    },
    {
      title: 'verified  account',
      description: 'Get a verified badge to make your profile look more professional and stand out.',
      image: Sub5
    },
    {
      title: 'export & mange contacts',
      description: 'Let others access your info even if they don’t have internet – anytime, anywhere.',
      image: Sub4
    },
    {
      title: 'Performance Tracking & Views',
      description: 'Track how people interact with your card – views, saved contacts, and more with built-in analytics.',
      image: Sub6
    },
    {
      title: 'unlimited links',
      description: 'Add multiple links for each platform – like social media, websites, email, WhatsApp, and more – with no limits.',
      image: Sub7
    },
    {
      title: 'Your Own Work Space',
      description: 'Create a personalized space to add files, images, custom links, and more – all in one place.',
      image: Sub9
    },
  ]
  return (
    <div className='flex flex-col gap-4 w-full min-h-screen py-8 px-4 mt-5'>
      {features.map((feature, index) => (
        <div key={index} className='flex flex-col gap-4 text-center text-black rounded-[15px] border border-[#FFF4D3] bg-gradient-to-b from-[rgba(255,244,211,0.7)] to-[rgba(153,146,126,0.7)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-6'>
          <h2 className='text-[20px] font-bold'>{feature.title}</h2>
          <p className='text-[16px]'>{feature.description}</p>
          <Image src={feature.image} alt={feature.title} width={500} height={500} />
        </div>
      ))}
      <TryNow />
    </div>
  );
};

export default SubscriptionPage;
