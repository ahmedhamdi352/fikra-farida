'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import ExportButton from './ExportButton';
import { useTranslations } from 'next-intl';
interface BasicThemeProps {
  profileData: ProfileForReadDTO;
  onUpdateVisitCount: (pk: string | number) => Promise<void>;
  handleSaveContact: () => void;
}

const BasicTheme = ({ profileData, onUpdateVisitCount, handleSaveContact }: BasicThemeProps) => {
  // Get the image URL from imageFilename
  const t = useTranslations('profile');
  const imageUrl = profileData?.imageFilename ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : 'https://placehold.co/96x96/E0B850/FFFFFF?text=Profile';
  const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;

  return (
    <div className="basic-profile w-full max-w-2xl mx-auto h-fit relative overflow-auto flex flex-col"
      style={{ background: (profileData?.ColorMode && profileData?.ColorMode?.length > 0) ? profileData?.ColorMode : 'linear-gradient(180deg, rgba(255, 233, 162, 0.10) 1.29%, rgba(239, 218, 152, 0.30) 8.49%, rgba(228, 209, 145, 0.40) 18.01%, rgba(223, 204, 142, 0.50) 21.33%, rgba(213, 194, 135, 0.60) 35.43%, rgba(201, 184, 128, 0.70) 44.01%, rgba(191, 174, 121, 0.80) 55.29%, rgba(179, 164, 114, 0.70) 66.27%, rgba(171, 156, 109, 0.50) 76%, rgba(164, 150, 104, 0.40) 94.83%, rgba(153, 140, 97, 0.20) 105.89%)' }}
    >
      <div className="relative">
        {/* Profile image positioning - centered at top for basic theme */}
        <div className="flex justify-start pt-8 z-20 mt-16 mx-5">
          {imageUrl && (
            <div className="w-40 h-40 rounded-lg overflow-hidden relative shadow-lg">
              <Image
                src={imageUrl}
                alt={profileData?.fullname || 'Profile'}
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/96x96/E0B850/FFFFFF?text=Profile'; }}
              />
            </div>
          )}
        </div>
        <ExportButton 
          profileData={profileData} 
          className="z-[10] absolute top-14 ltl:right-2 ltl:left-auto rtl:left-2 rtl:right-auto" 
        />
      </div>
      
      <div className="flex flex-col items-start justify-start pt-4 pb-4 px-8 relative z-10">
        <div className='flex items-center gap-2'>
          <h2 className="text-3xl font-bold mb-1 leading-tight text-left text-black">{profileData?.fullname}</h2>
          {profileData?.type === 2 && (
            <span className="text-[var(--main-color1)]" title="Verified Professional">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <p className="text-lg mb-1 text-left text-black">{`${profileData?.jobTitle || 'Member'} ${profileData?.company ? ` @ ${profileData?.company}` : ''}`}</p>
        <p className="text-base text-left max-w-xs text-black">{profileData?.bio}</p>
      </div>

      <div className="flex justify-center gap-4 py-4 pb-8">
        {/* Phone Icon */}
        {profileData?.showPhone && profileData?.phoneNumber1.length > 0 && <button
          onClick={() => {
            if (profileData?.phoneNumber1) {
              window.location.href = `tel:${profileData.phoneNumber1}`;
            }
          }}
          className="p-4 rounded-full hover:bg-gray-200 transition-colors"
          style={{
            backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
          }}
          aria-label="Call"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke='currentColor'
            style={{ color: 'black' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>}

        {/* Email Icon */}
        {profileData?.showEmail && profileData?.email.length > 0 && <button
          onClick={() => {
            if (profileData?.email) {
              window.location.href = `mailto:${profileData.email}`;
            }
          }}
          className="p-4 rounded-full hover:bg-gray-200 transition-colors"
          style={{
            backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
          }}
          aria-label="Email"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke='currentColor'
            style={{ color: 'black' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>}

        {profileData?.showWebsite && profileData?.websiteUrl.length > 0 && <button
          onClick={() => {
            if (profileData?.websiteUrl) {
              window.open(profileData.websiteUrl.startsWith('http') ? profileData.websiteUrl : `https://${profileData.websiteUrl}`, '_blank');
            }
          }}
          className="p-4 rounded-full hover:bg-gray-200 transition-colors"
          style={{
            backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
          }}
          aria-label="Website"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke='currentColor'
            style={{ color: 'black' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </button>}
      </div>

      {profileData?.saveContact && <div className="px-6 pb-6 relative z-10">
        {profileData?.saveContact && (
          <button
            onClick={handleSaveContact}
            style={{
              backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
            }}
            className="w-full text-black py-4 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105"
          >
            {t('saveContact')}
          </button>
        )}
      </div>}

      {/* Profile Links List - Sorted by sort property */}
      <div className="px-6 flex flex-col gap-2 relative z-10 w-full pb-10">
        {profileData?.links
          ?.filter(link => link.sort && link.sort > 0)
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
          .map((link) => (
            <Link
              onClick={() => onUpdateVisitCount(link.pk)}
              href={link.url}
              target="_blank"
              key={link.pk}
              style={{ borderRadius: '12px', background: 'rgba(255, 244, 211, 0.10)' }}
              className="px-2 flex items-center justify-start"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Image
                  src={`${baseIconsUrl}${link.iconurl}`}
                  alt={link.title}
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/24x24/1877F2/FFFFFF?text=Link'; }}
                />
              </div>
              <span className="text-[16px] text-white font-semibold">{link.title}</span>
            </Link>
          ))}
      </div>
      
      <div className="px-6 pb-6 relative z-10 flex justify-center">
        <Link
          href='/products'
          style={{
            borderRadius: '12px',
          }}
          className="w-[70%]  text-white bg-transparent border border-[var(--main-color1)] hover:bg-yellow-600 py-4 px-6 rounded-lg text-center font-[400] text-sm transition duration-300 shadow-xl transform hover:scale-105">
          {t('createYourOwnCard')}
        </Link>
      </div>
    </div>
  );
};

export default BasicTheme;
