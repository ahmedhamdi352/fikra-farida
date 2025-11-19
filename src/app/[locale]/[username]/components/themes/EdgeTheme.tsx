'use client';

import Image from 'next/image';
import Link from 'next/link';
import CoverImage from 'assets/images/cover.jpeg';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import ExportButton from './ExportButton';
import { useTranslations } from 'next-intl';
import ActionButtons from './ActionButtons';
import PreviewImage from 'assets/images/No_image_preview.jpg';
interface EdgeThemeProps {
  profileData: ProfileForReadDTO;
  onUpdateVisitCount: (pk: string | number) => Promise<void>;
  handleSaveContact: () => void;
}

const EdgeTheme = ({ profileData, onUpdateVisitCount, handleSaveContact }: EdgeThemeProps) => {
  // Get the image URL from imageFilename
  const t = useTranslations('profile');
  const imageUrl = profileData?.imageFilename  && profileData.imageFilename !== 'avatar1.png' ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : PreviewImage;
  const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;

  // Cover Photo Component
  const CoverPhoto = () => {
    const coverSrc = profileData?.coverImage ? `https://fikrafarida.com/Media/Profiles/${profileData.coverImage}` : CoverImage;

    return (
      <div className="w-full h-52 relative overflow-hidden">
        <Image
          src={coverSrc}
          alt="Profile Cover"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/30"></div>
      </div>
    );
  };

  return (
    <div className="basic-profile w-full max-w-2xl mx-auto h-fit relative overflow-auto flex flex-col"
      style={{ background: (profileData?.ColorMode && profileData?.ColorMode?.length > 0) ? profileData?.ColorMode : 'linear-gradient(180deg, rgba(255, 233, 162, 0.10) 1.29%, rgba(239, 218, 152, 0.30) 8.49%, rgba(228, 209, 145, 0.40) 18.01%, rgba(223, 204, 142, 0.50) 21.33%, rgba(213, 194, 135, 0.60) 35.43%, rgba(201, 184, 128, 0.70) 44.01%, rgba(191, 174, 121, 0.80) 55.29%, rgba(179, 164, 114, 0.70) 66.27%, rgba(171, 156, 109, 0.50) 76%, rgba(164, 150, 104, 0.40) 94.83%, rgba(153, 140, 97, 0.20) 105.89%)' }}
    >
      <div className="relative">
        <CoverPhoto />
        <div dir="ltr" className="absolute top-[50%] left-[5%] z-20 flex justify-start">
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
        <ExportButton profileData={profileData}
        />
      </div>
      
      <div dir="ltr" className="flex flex-col items-start justify-start pt-16 pb-4 px-8 relative z-10">
        <div className='flex items-center gap-2'>
          <h2 className="text-3xl font-bold  leading-tight text-left">{profileData?.fullname}</h2>
          {profileData?.type === 2 && (
            <span className="text-[var(--main-color1)]" title="Verified Professional">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <p className="text-lg text-left">{`${profileData?.jobTitle || 'Member'} ${profileData?.company ? ` @ ${profileData?.company}` : ''}`}</p>
        <p className="text-base text-left max-w-xs">{profileData?.bio}</p>
      </div>

      <ActionButtons profileData={profileData} handleSaveContact={handleSaveContact} />

      {/* Profile Links Grid - Sorted by sort property */}
      <div className="px-6 grid grid-cols-3 gap-4 relative z-10 w-full pb-10">
        {profileData?.links
          ?.filter(link => link.sort && link.sort > 0)
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
          .map((link) => (
            <div key={link.pk} style={{ borderRadius: '12px', background: 'rgba(255, 244, 211, 0.10)' }} className="p-3 flex flex-col items-center justify-center shadow-sm">
              <Link
                onClick={() => onUpdateVisitCount(link.pk)}
                style={profileData?.iconColor?.length > 0 ? { color: profileData.iconColor } : { color: 'black' }}
                href={link.url} target="_blank" className="w-16 h-16 rounded-full flex items-center justify-center mb-1">
                <Image
                  src={`${baseIconsUrl}${link.iconurl}`}
                  alt={link.title}
                  width={60}
                  height={60}
                  className="object-contain w-full h-full"
                />
              </Link>
              <span className="text-[16px] text-white font-semibold mt-1 max-w-[100px] truncate">{link.title}</span>
            </div>
          ))}
      </div>
      
      <div className="px-6 pb-6 relative z-10 flex justify-center">
        <Link
          href='/collections'
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

export default EdgeTheme;
