'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { saveAs } from 'file-saver';
import LockedAccountPopup from './LockedAccountPopup'; // Assuming this component exists
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO'; // Assuming this type exists
import CoverImage from 'assets/images/cover.jpeg'
import Link from 'next/link';
interface ClientWrapperProps {
  isAccountLocked: boolean;
  profileData?: ProfileForReadDTO;
  theme?: string;
}

interface VCardProfile {
  fullname?: string;
  phoneNumber?: string;
  email?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
}

const generateVCard = (profile: VCardProfile) => {
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullname || ''}`,
    `TEL;type=CELL:${profile.phoneNumber || ''}`,
    `EMAIL:${profile.email || ''}`,
    `TITLE:${profile.jobTitle || ''}`,
    `ORG:${profile.company || ''}`,
    `NOTE:${profile.bio || ''}`,
    'END:VCARD'
  ].join('\n');

  return new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
};

export default function ClientWrapper({ isAccountLocked, profileData, theme = 'premium' }: ClientWrapperProps) {
  const [showPopup, setShowPopup] = useState(false);
  const handleSaveContact = () => {
    if (!profileData) return;
    try {
      const vCardBlob = generateVCard(profileData);
      saveAs(vCardBlob, `${profileData.fullname || 'contact'}.vcf`);
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact. Please try again.');
    }
  };

  useEffect(() => {
    if (isAccountLocked) {
      setShowPopup(true);
    }
  }, [isAccountLocked]);

  useEffect(() => {
    if (profileData?.directurl) {
      window.location.replace(profileData.directurl);
    }
  }, [profileData]);
  // SVG background for premium and rounded themes (lighter, golden tones)
  const lightThemeBackground = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 393 1002" fill="none" className="absolute inset-0 z-0">
        <path d="M0 0H393V1002H0V0Z" fill="url(#lightGradient)" />
        <defs>
          <linearGradient id="lightGradient" x1="197" y1="0" x2="197" y2="1002" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF7E0" stopOpacity="0.1" /> {/* Lighter start */}
            <stop offset="20%" stopColor="#F5E0B3" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#E6C78C" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#D9B26B" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#CC9C4A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#BF8529" stopOpacity="0.2" /> {/* Darker end */}
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // SVG background for edge theme (darker, cooler tones)
  const darkThemeBackground = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 393 1002" fill="none" className="absolute inset-0 z-0">
        <path d="M0 0H393V1002H0V0Z" fill="url(#darkGradient)" />
        <defs>
          <linearGradient id="darkGradient" x1="197" y1="0" x2="197" y2="1002" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.8" /> {/* Dark Slate Blue */}
            <stop offset="20%" stopColor="#1E293B" stopOpacity="0.9" /> {/* Even darker slate */}
            <stop offset="40%" stopColor="#0F172A" stopOpacity="1" /> {/* Very dark blue */}
            <stop offset="60%" stopColor="#1E293B" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#334155" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.7" /> {/* Slightly lighter slate */}
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Cover photo URLs for different themes
  const coverPhotos = {
    // Using the provided golden abstract image for premium and rounded themes
    premium: CoverImage, // Path if you save the image locally
    rounded: CoverImage, // Same image for rounded theme
    edge: CoverImage, // Different image for edge theme
  };

  // Common Export Button Component
  const ExportButton = ({ textColor, bgColor, hoverBgColor }: { textColor: string, bgColor: string, hoverBgColor: string }) => (
    <div className={`absolute top-4 left-4 z-20`}>
      <button className={`flex items-center space-x-1 ${bgColor} hover:${hoverBgColor} ${textColor} py-2 px-4 rounded-md text-sm font-medium transition duration-300 shadow-md`}>
        {/* SVG for Export Icon - Example, replace with actual icon if needed */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Export</span>
      </button>
    </div>
  );

  // Cover Photo Component
  const CoverPhoto = ({ theme }: { theme: string }) => {
    let coverSrc;

    switch (theme) {
      case 'premium':
        coverSrc = coverPhotos.premium;
        break;
      case 'rounded':
        coverSrc = coverPhotos.rounded;
        break;
      case 'edge':
        coverSrc = coverPhotos.edge;
        break;
      default:
        coverSrc = coverPhotos.premium;
    }

    return (
      <div className="w-full h-52 relative overflow-hidden"> {/* Reduced height as requested */}
        <Image
          src={coverSrc}
          alt="Profile Cover"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
        {/* Adjusted overlay opacity for better visibility of the golden abstract pattern */}
        <div className={`absolute inset-0 ${theme === 'edge' ? 'bg-slate-900/30' : 'bg-amber-900/10'}`}></div>
      </div>
    );
  };

  // Render profile content based on theme
  const renderProfileContent = () => {
    if (!profileData) return null;

    // Get the image URL from imageFilename
    const imageUrl = profileData.imageFilename ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : 'https://placehold.co/96x96/E0B850/FFFFFF?text=Profile'; // Placeholder for missing image
    const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;

    switch (theme) {
      case 'premium':
        return (
          <div className="premium-profile w-full max-w-2xl mx-auto h-fit relative overflow-auto flex flex-col"
            style={{ background: 'linear-gradient(180deg, rgba(255, 233, 162, 0.10) 1.29%, rgba(239, 218, 152, 0.30) 8.49%, rgba(228, 209, 145, 0.40) 18.01%, rgba(223, 204, 142, 0.50) 21.33%, rgba(213, 194, 135, 0.60) 35.43%, rgba(201, 184, 128, 0.70) 44.01%, rgba(191, 174, 121, 0.80) 55.29%, rgba(179, 164, 114, 0.70) 66.27%, rgba(171, 156, 109, 0.50) 76%, rgba(164, 150, 104, 0.40) 94.83%, rgba(153, 140, 97, 0.20) 105.89%)' }}
          >
            {/* {lightThemeBackground()} */}
            <div className="relative">
              <CoverPhoto theme="premium" />
              <div className="absolute top-[50%] left-[5%] z-20 flex justify-start">
                {imageUrl && (
                  <div className="w-40 h-40 rounded-lg overflow-hidden relative shadow-lg">
                    <Image
                      src={imageUrl}
                      alt={profileData.fullname || 'Profile'}
                      fill
                      sizes="(max-width: 768px) 100vw, 280px" // Optimized for responsive image loading
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/96x96/E0B850/FFFFFF?text=Profile'; }} // Fallback image on error
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  const profileUrl = `https://www.fikrafarida.com/${profileData?.username}`; // Replace with actual user profile URL
                  navigator.clipboard.writeText(profileUrl).then(() => {
                    alert('Profile link copied to clipboard!');
                  });
                  // Alternatively, use native share dialog:
                  navigator.share?.({ url: profileUrl });
                }}
                className="absolute top-10 right-2 flex gap-1  bg-[#F4DD94] hover:bg-yellow-500 text-white py-2 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105">

                <p className='text-black text-[12px] font-semibold'>
                  Export
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.75 4.5C21.75 3.90326 21.5129 3.33097 21.091 2.90901C20.669 2.48705 20.0967 2.25 19.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V12C2.25 12.1989 2.32902 12.3897 2.46967 12.5303C2.61032 12.671 2.80109 12.75 3 12.75C3.19891 12.75 3.38968 12.671 3.53033 12.5303C3.67098 12.3897 3.75 12.1989 3.75 12V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H13.5C13.3011 20.25 13.1103 20.329 12.9697 20.4697C12.829 20.6103 12.75 20.8011 12.75 21C12.75 21.1989 12.829 21.3897 12.9697 21.5303C13.1103 21.671 13.3011 21.75 13.5 21.75H19.5C20.0967 21.75 20.669 21.5129 21.091 21.091C21.5129 20.669 21.75 20.0967 21.75 19.5V4.5Z" fill="black" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 9C6.75 8.80109 6.82902 8.61032 6.96967 8.46967C7.11032 8.32902 7.30109 8.25 7.5 8.25H15C15.1989 8.25 15.3897 8.32902 15.5303 8.46967C15.671 8.61032 15.75 8.80109 15.75 9V16.5C15.75 16.6989 15.671 16.8897 15.5303 17.0303C15.3897 17.171 15.1989 17.25 15 17.25C14.8011 17.25 14.6103 17.171 14.4697 17.0303C14.329 16.8897 14.25 16.6989 14.25 16.5V9.75H7.5C7.30109 9.75 7.11032 9.67098 6.96967 9.53033C6.82902 9.38968 6.75 9.19891 6.75 9Z" fill="black" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.531 8.46936C15.6008 8.53903 15.6562 8.6218 15.694 8.71291C15.7318 8.80403 15.7513 8.90171 15.7513 9.00036C15.7513 9.09901 15.7318 9.1967 15.694 9.28781C15.6562 9.37893 15.6008 9.4617 15.531 9.53136L3.53097 21.5314C3.39014 21.6722 3.19913 21.7513 2.99997 21.7513C2.80081 21.7513 2.6098 21.6722 2.46897 21.5314C2.32814 21.3905 2.24902 21.1995 2.24902 21.0004C2.24902 20.8012 2.32814 20.6102 2.46897 20.4694L14.469 8.46936C14.5386 8.39952 14.6214 8.3441 14.7125 8.30629C14.8036 8.26849 14.9013 8.24902 15 8.24902C15.0986 8.24902 15.1963 8.26849 15.2874 8.30629C15.3785 8.3441 15.4613 8.39952 15.531 8.46936Z" fill="black" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-start justify-start pt-16 pb-8 px-8 ml-2 relative z-10">
              <h2 className="text-3xl font-bold mb-2 leading-tight text-left">{profileData.fullname}</h2>
              <p className="text-lg mb-3 text-left">{profileData.jobTitle || 'Member'}</p>
              <p className="text-base text-left max-w-xs">{profileData.bio}</p>
            </div>

            <div className="px-6 pb-6 relative z-10">
              {profileData.saveContact && (
                <button
                  onClick={handleSaveContact}
                  className="w-full text-black bg-yellow-500 hover:bg-yellow-600 py-4 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105"
                >
                  Save Contact
                </button>
              )}
            </div>

            {/* Profile Links Grid - Matching screenshot design */}
            <div className="px-6 grid grid-cols-3 gap-4 relative z-10 w-full pb-10">
              {/* Facebook Links - 9 identical items as shown in screenshot */}
              {profileData.links.map((link, index) => (
                <div key={index} style={{ borderRadius: '12px', background: 'rgba(255, 244, 211, 0.10)' }} className="p-3 flex flex-col items-center justify-center shadow-sm">
                  <Link href={link.url} target="_blank" className="w-16 h-16 rounded-full flex items-center justify-center mb-1">
                    <Image
                      src={`${baseIconsUrl}${link.iconurl}`}
                      alt={link.title}
                      width={52}
                      height={52}
                      // sizes="(max-width: 768px) 100vw, 24px"
                      className="object-contain"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/24x24/1877F2/FFFFFF?text=Link'; }}
                    />
                  </Link>
                  <span className="text-[16px] text-white font-semibold mt-1 max-w-[100px] truncate">{link.title}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 relative z-10 flex justify-center">
              {profileData.saveContact && (
                <Link
                  href='/products'
                  style={{
                    borderRadius: '12px',
                  }}
                  className="w-[70%]  text-white bg-transparent border border-[var(--main-color1)] hover:bg-yellow-600 py-4 px-6 rounded-lg text-center font-[400] text-sm transition duration-300 shadow-xl transform hover:scale-105">
                  creat your own card
                </Link>
              )}
            </div>
          </div>
        );

      case 'edge':
        return (
          <div className="edge-profile w-full h-screen max-w-md mx-auto relative overflow-hidden flex flex-col">
            {darkThemeBackground()}
            <div className="relative">
              <CoverPhoto theme="edge" />
              <ExportButton textColor="text-gray-200" bgColor="bg-gray-700" hoverBgColor="bg-gray-600" />
              <div className="absolute left-0 right-0 top-0 flex justify-center -mt-14 z-20">
                {imageUrl && (
                  <div className="w-32 h-32 overflow-hidden relative shadow-lg"> {/* No rounded classes for edge */}
                    <Image
                      src={imageUrl}
                      alt={profileData.fullname || 'Profile'}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/128x128/334155/FFFFFF?text=Profile'; }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-start pt-16 pb-8 px-4 relative z-10 flex-grow">
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight text-center">{profileData.fullname}</h2>
              <p className="text-slate-300 text-lg mb-3 text-center">{profileData.jobTitle || 'Member'}</p>
              <p className="text-slate-400 text-base text-center max-w-xs">{profileData.bio}</p>
            </div>

            <div className="px-6 pb-10 relative z-10">
              {profileData.saveContact && (
                <button className="w-full bg-slate-600 hover:bg-slate-700 text-white py-4 px-6 text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105"> {/* No rounded classes for button */}
                  Save Contact
                </button>
              )}
            </div>
          </div>
        );

      case 'rounded':
        return (
          <div className="rounded-profile w-full h-screen max-w-md mx-auto relative overflow-hidden flex flex-col">
            {lightThemeBackground()}
            <div className="relative">
              <CoverPhoto theme="rounded" />
              <ExportButton textColor="text-amber-800" bgColor="bg-amber-50" hoverBgColor="bg-amber-100" />
              <div className="absolute left-0 right-0 top-0 flex justify-center -mt-14 z-20">
                {imageUrl && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-amber-200 relative shadow-lg">
                    <Image
                      src={imageUrl}
                      alt={profileData.fullname || 'Profile'}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/112x112/FDE68A/8B5E00?text=Profile'; }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-start pt-16 pb-8 px-4 relative z-10 flex-grow">
              <h1 className="text-3xl font-bold text-amber-900 mb-2 leading-tight text-center">{profileData.fullname}</h1>
              <p className="text-amber-800 text-lg mb-3 text-center">{profileData.jobTitle || 'Member'}</p>
              <p className="text-amber-800 text-base text-center max-w-xs">{profileData.bio}</p>
            </div>

            <div className="px-6 pb-10 relative z-10">
              {profileData.saveContact && (
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-4 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105">
                  Save Contact
                </button>
              )}
            </div>
          </div>
        );

      default:
        // Default to premium if theme is not recognized
        return renderProfileContent(); // Recursively call for default premium
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    console.log('Popup closed by user');
  };

  return (
    <>
      {/* Render the theme-based profile content */}
      {!isAccountLocked && profileData && renderProfileContent()}
      {!isAccountLocked && profileData &&
        <>


        </>

      }

      {/* Show locked account popup if account is locked */}
      {isAccountLocked && (
        <LockedAccountPopup
          isOpen={showPopup}
          onClose={handleClose}
        />
      )}
    </>
  );
}
