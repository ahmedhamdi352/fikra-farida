'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { saveAs } from 'file-saver';
import LockedAccountPopup from './LockedAccountPopup';
import AutoConnectPopup from './AutoConnectPopup';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import { useUpdateVisitCountMutation } from 'hooks/links/mutations/useUpdateVisitCountMutation';
import CoverImage from 'assets/images/cover.jpeg'
import Link from 'next/link';

interface ClientWrapperProps {
  isAccountLocked: boolean;
  profileData?: ProfileForReadDTO;
  theme?: string;
}

interface VCardProfile {
  fullname?: string;
  phoneNumber1?: string;
  email?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  websiteUrl?: string;
  imageFilename?: string;
  links?: Array<{
    title: string;
    url: string;
  }>;
}

const generateVCard = async (profile: VCardProfile & { username?: string }) => {
  // Prepare photo URL if available - ensure it's accessible and properly formatted
  const photoUrl = profile.imageFilename
    ? `https://fikrafarida.com/Media/Profiles/${profile.imageFilename}`
    : null;

  // Clean and validate the fullname - ensure it's not empty and properly formatted
  const fullName = (profile.fullname || '').trim();
  const displayName = fullName || profile.username || 'Contact';

  // Split name for proper vCard N field format (Last;First;Middle;Prefix;Suffix)
  const nameParts = displayName.split(' ');
  const lastName = nameParts.length > 1 ? nameParts.slice(-1)[0] : '';
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : displayName;

  // Determine image type from filename extension
  const getImageType = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'JPEG';
      case 'png':
        return 'PNG';
      case 'gif':
        return 'GIF';
      case 'webp':
        return 'WEBP';
      default:
        return 'JPEG'; // Default to JPEG for better compatibility
    }
  };

  // Function to convert image to base64
  const getImageAsBase64 = async (url: string): Promise<string | null> => {
    try {
      // Try with CORS mode first
      const response = await fetch(url, { 
        mode: 'cors',
        cache: 'no-cache'
      });
      if (!response.ok) {
        console.warn('Failed to fetch image with CORS:', response.status);
        // Try without CORS as fallback
        try {
          const fallbackResponse = await fetch(url, { mode: 'no-cors' });
          if (fallbackResponse.type === 'opaque') {
            console.warn('Image fetch returned opaque response, using URI fallback');
            return null;
          }
        } catch (fallbackError) {
          console.warn('Fallback fetch also failed:', fallbackError);
          return null;
        }
        return null;
      }
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove data:image/...;base64, prefix
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Error converting image to base64:', error);
      return null;
    }
  };

  // Escape special characters in vCard fields
  const escapeVCardField = (field: string) => {
    return field
      .replace(/\\/g, '\\\\') // Escape backslashes
      .replace(/;/g, '\\;')   // Escape semicolons
      .replace(/,/g, '\\,')   // Escape commas
      .replace(/\n/g, '\\n')  // Escape newlines
      .replace(/\r/g, '\\r'); // Escape carriage returns
  };

  // Get base64 photo if available
  let photoField = '';
  if (photoUrl) {
    const base64Photo = await getImageAsBase64(photoUrl);
    if (base64Photo) {
      const imageType = getImageType(profile.imageFilename || '');
      photoField = `PHOTO;ENCODING=BASE64;TYPE=${imageType}:${base64Photo}`;
    } else {
      // Fallback to URI if base64 conversion fails
      photoField = `PHOTO;VALUE=URI;TYPE=${getImageType(profile.imageFilename || '')}:${photoUrl}`;
    }
  }

  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardField(displayName)}`,
    // Add N field for proper name parsing (Last;First;Middle;Prefix;Suffix)
    `N:${escapeVCardField(lastName)};${escapeVCardField(firstName)};;;`,
    // Add photo with base64 encoding for better mobile compatibility
    ...(photoField ? [photoField] : []),
    `TEL;type=CELL:${profile.phoneNumber1 || ''}`,
    `EMAIL:${profile.email || ''}`,
    `TITLE:${escapeVCardField(profile.jobTitle || '')}`,
    `ORG:${escapeVCardField(profile.company || '')}`,
    // Add profile's direct URL as the first website
    ...(profile.username ? [`URL;type=Profile:${process.env.NEXT_PUBLIC_BASE_URL}/${profile.username}`] : []),
    // Add other websites
    ...(profile.websiteUrl ? [`URL:${profile.websiteUrl}`] : []),
    ...(profile.links?.map(link => `URL;type=${escapeVCardField(link.title)}:${link.url}`) || []),
    `NOTE:${escapeVCardField(profile.bio || '')}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');

  return new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
};


export default function ClientWrapper({ isAccountLocked, profileData, theme = 'basic' }: ClientWrapperProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showAutoConnectPopup, setShowAutoConnectPopup] = useState(false);
  const { onUpdateVisitCount } = useUpdateVisitCountMutation();

  const handleSaveContact = async () => {
    if (!profileData) return;
    try {
      // Debug logging to help identify issues
      console.log('Profile data for vCard:', {
        fullname: profileData.fullname,
        company: profileData.company,
        imageFilename: profileData.imageFilename,
        email: profileData.email,
        phoneNumber1: profileData.phoneNumber1
      });

      // Show loading message
      alert('Generating contact with photo...');
      
      const vCardBlob = await generateVCard(profileData);
      
      // Debug: Log the generated vCard content
      vCardBlob.text().then(vCardText => {
        console.log('Generated vCard content:', vCardText);
      });
      
      // Create a more descriptive filename
      const cleanName = (profileData.fullname || profileData.username || 'contact')
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .trim();
      
      saveAs(vCardBlob, `${cleanName}.vcf`);
      
      // Show success message
      alert('Contact saved successfully with photo!');
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact. Please try again.');
    }
  };

  useEffect(() => {
    if (profileData?.autoconnect) {
      setShowAutoConnectPopup(true);
    }
  }, [profileData]);

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


  // Cover photo URLs for different themes
  const coverPhotos = {
    basic: CoverImage, // Path if you save the image locally
    rounded: CoverImage, // Same image for rounded theme
    edge: CoverImage, // Different image for edge theme
  };

  // Cover Photo Component
  const CoverPhoto = ({ theme }: { theme: string }) => {
    let coverSrc;

    switch (theme) {
      case 'basic':
        coverSrc = profileData?.coverImage ? `https://fikrafarida.com/Media/Profiles/${profileData.coverImage}` : coverPhotos.basic;
        break;
      case 'rounded':
        coverSrc = profileData?.coverImage ? `https://fikrafarida.com/Media/Profiles/${profileData.coverImage}` : coverPhotos.rounded;
        break;
      case 'edge':
        coverSrc = profileData?.coverImage ? `https://fikrafarida.com/Media/Profiles/${profileData.coverImage}` : coverPhotos.edge;
        break;
      default:
        coverSrc = profileData?.coverImage ? `https://fikrafarida.com/Media/Profiles/${profileData.coverImage}` : coverPhotos.basic;
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
  const renderProfileContent = (theme: string, onUpdateVisitCount: (pk: string | number) => Promise<void>) => {
    // Get the image URL from imageFilename
    const imageUrl = profileData?.imageFilename ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : 'https://placehold.co/96x96/E0B850/FFFFFF?text=Profile'; // Placeholder for missing image
    const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;
    console.log(theme)
    switch (theme) {
      case 'edge':
        return (
          <div className="basic-profile w-full max-w-2xl mx-auto h-fit relative overflow-auto flex flex-col"
            style={{ background: (profileData?.ColorMode && profileData?.ColorMode?.length > 0) ? profileData?.ColorMode : 'linear-gradient(180deg, rgba(255, 233, 162, 0.10) 1.29%, rgba(239, 218, 152, 0.30) 8.49%, rgba(228, 209, 145, 0.40) 18.01%, rgba(223, 204, 142, 0.50) 21.33%, rgba(213, 194, 135, 0.60) 35.43%, rgba(201, 184, 128, 0.70) 44.01%, rgba(191, 174, 121, 0.80) 55.29%, rgba(179, 164, 114, 0.70) 66.27%, rgba(171, 156, 109, 0.50) 76%, rgba(164, 150, 104, 0.40) 94.83%, rgba(153, 140, 97, 0.20) 105.89%)' }}
          >
            <div className="relative">
              <CoverPhoto theme="basic" />
              <div className="absolute top-[50%] left-[5%] z-20 flex justify-start">
                {imageUrl && (
                  <div className="w-40 h-40 rounded-lg overflow-hidden relative shadow-lg">
                    <Image
                      src={imageUrl}
                      alt={profileData?.fullname || 'Profile'}
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
            <div className="flex flex-col items-start justify-start pt-16 pb-4 px-8 relative z-10">
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

            <div className="flex justify-center space-x-8 py-4 pb-8">
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
                  style={{ color: 'black' }}>
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
                  style={{ color: 'black' }}>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke='currentColor'
                  style={{ color: 'black' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </button>}
            </div>

            {
              profileData?.saveContact && <div className="px-6 pb-6 relative z-10">
                {profileData?.saveContact && (
                  <button
                    onClick={handleSaveContact}
                    style={{
                      backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
                    }}
                    className="w-full text-black py-4 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105"
                  >
                    Save Contact
                  </button>
                )}
              </div>
            }

            {/* Profile Links Grid - Sorted by sort property */}
            <div className="px-6 grid grid-cols-3 gap-4 relative z-10 w-full pb-10">
              {profileData?.links
                ?.filter(link => link.sort && link.sort > 0) // Only include links with sort > 0
                .sort((a, b) => (a.sort || 0) - (b.sort || 0)) // Sort by sort value
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
                href='/products'
                style={{
                  borderRadius: '12px',
                }}
                className="w-[70%]  text-white bg-transparent border border-[var(--main-color1)] hover:bg-yellow-600 py-4 px-6 rounded-lg text-center font-[400] text-sm transition duration-300 shadow-xl transform hover:scale-105">
                creat your own card
              </Link>
            </div>
          </div >
        );

      case 'basic':
        return (
          <div className="basic-profile w-full max-w-2xl mx-auto h-fit relative overflow-auto flex flex-col"
            style={{ background: (profileData?.ColorMode && profileData?.ColorMode?.length > 0) ? profileData?.ColorMode : 'linear-gradient(180deg, rgba(255, 233, 162, 0.10) 1.29%, rgba(239, 218, 152, 0.30) 8.49%, rgba(228, 209, 145, 0.40) 18.01%, rgba(223, 204, 142, 0.50) 21.33%, rgba(213, 194, 135, 0.60) 35.43%, rgba(201, 184, 128, 0.70) 44.01%, rgba(191, 174, 121, 0.80) 55.29%, rgba(179, 164, 114, 0.70) 66.27%, rgba(171, 156, 109, 0.50) 76%, rgba(164, 150, 104, 0.40) 94.83%, rgba(153, 140, 97, 0.20) 105.89%)' }}
          >
            {/* {lightThemeBackground()} */}
            <div className="relative">
              {/* No cover photo for basic theme */}

              {/* Profile image positioning - centered at top for basic theme */}
              <div className="flex justify-start pt-8 z-20 mt-16 mx-5">
                {imageUrl && (
                  <div className="w-40 h-40 rounded-lg overflow-hidden relative shadow-lg">
                    <Image
                      src={imageUrl}
                      alt={profileData?.fullname || 'Profile'}
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
                className="z-[10] absolute top-14 right-2 flex gap-1  bg-[#F4DD94] hover:bg-yellow-500 text-white py-2 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105">

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

            <div className="flex justify-center space-x-8 py-4 pb-8">
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
                  Save Contact
                </button>
              )}
            </div>}

            {/* Profile Links List - Sorted by sort property */}
            <div className="px-6 flex flex-col gap-2 relative z-10 w-full pb-10">
              {profileData?.links
                ?.filter(link => link.sort && link.sort > 0) // Only include links with sort > 0
                .sort((a, b) => (a.sort || 0) - (b.sort || 0)) // Sort by sort value
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
                creat your own card
              </Link>
            </div>
          </div>
        );

      case 'rounded':
        return (
          <div className="basic-profile w-full max-w-2xl mx-auto h-fit relative overflow-auto flex flex-col"
            style={{ background: (profileData?.ColorMode && profileData?.ColorMode?.length > 0) ? profileData?.ColorMode : 'linear-gradient(180deg, rgba(255, 233, 162, 0.10) 1.29%, rgba(239, 218, 152, 0.30) 8.49%, rgba(228, 209, 145, 0.40) 18.01%, rgba(223, 204, 142, 0.50) 21.33%, rgba(213, 194, 135, 0.60) 35.43%, rgba(201, 184, 128, 0.70) 44.01%, rgba(191, 174, 121, 0.80) 55.29%, rgba(179, 164, 114, 0.70) 66.27%, rgba(171, 156, 109, 0.50) 76%, rgba(164, 150, 104, 0.40) 94.83%, rgba(153, 140, 97, 0.20) 105.89%)' }}
          >
            {/* {lightThemeBackground()} */}
            <div className="relative">
              <CoverPhoto theme="basic" />
              <div className="absolute top-[50%] inset-x-0 z-20 flex justify-center">
                {imageUrl && (
                  <div className="w-40 h-40 rounded-full overflow-hidden relative shadow-lg">
                    <Image
                      src={imageUrl}
                      alt={profileData?.fullname || 'Profile'}
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
            <div className="flex flex-col items-center justify-center pt-16 pb-4 px-8  relative z-10">
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
              <p className="text-lg mb-1 text-center">{`${profileData?.jobTitle || 'Member'} ${profileData?.company ? ` @ ${profileData?.company}` : ''}`}</p>
              <p className="text-base text-center max-w-xs">{profileData?.bio}</p>
            </div>

            <div className="flex justify-center space-x-8 py-4 pb-8">
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
              <button
                onClick={handleSaveContact}
                style={{
                  backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
                }}
                className="w-full text-black py-4 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105"
              >
                Save Contact
              </button>

            </div>}

            {/* Profile Links Grid - Sorted by sort property */}
            <div className="px-6 grid grid-cols-3 gap-4 relative z-10 w-full pb-10">
              {profileData?.links
                ?.filter(link => link.sort && link.sort > 0) // Only include links with sort > 0
                .sort((a, b) => (a.sort || 0) - (b.sort || 0)) // Sort by sort value
                .map((link) => (
                  <div key={link.pk} style={{ borderRadius: '12px' }} className="p-3 flex flex-col items-center justify-center">
                    <Link href={link.url} onClick={() => onUpdateVisitCount(link.pk)} target="_blank" className="w-16 h-16 rounded-full flex items-center justify-center mb-1">
                      <Image
                        src={`${baseIconsUrl}${link.iconurl}`}
                        alt={link.title}
                        width={65}
                        height={65}
                        className="object-contain"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/24x24/1877F2/FFFFFF?text=Link'; }}
                      />
                    </Link>
                    <span className="text-[16px] text-white font-semibold mt-1 max-w-[100px] truncate">{link.title}</span>
                  </div>
                ))}
            </div>
            <div className="px-6 pb-6 relative z-10 flex justify-center">
              <Link
                href='/products'
                style={{
                  borderRadius: '12px',
                }}
                className="w-[70%]  text-white bg-transparent border border-[var(--main-color1)] hover:bg-yellow-600 py-4 px-6 rounded-lg text-center font-[400] text-sm transition duration-300 shadow-xl transform hover:scale-105">
                creat your own card
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleCloseAutoConnectPopup = () => {
    setShowAutoConnectPopup(false);
  };
  return (
    <>
      {!isAccountLocked && profileData && renderProfileContent(theme || 'basic', async (pk: string | number) => { await onUpdateVisitCount(pk || profileData.userPk); })}
      {isAccountLocked && profileData &&
        <>
        </>
      }
      {isAccountLocked && (
        <LockedAccountPopup
          isOpen={showPopup}
          onClose={handleClose}
        />
      )}
      {
        !isAccountLocked && profileData?.autoconnect && (
          <AutoConnectPopup
            isOpen={showAutoConnectPopup}
            onClose={handleCloseAutoConnectPopup}
            userPk={profileData.userPk}
          />
        )
      }
    </>
  );
}
