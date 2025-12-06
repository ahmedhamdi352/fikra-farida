'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { saveAs } from 'file-saver';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import { useUpdateVisitCountMutation } from 'hooks/links/mutations/useUpdateVisitCountMutation';

const LockedAccountPopup = lazy(() => import('./LockedAccountPopup'));
const AutoConnectPopup = lazy(() => import('./AutoConnectPopup'));
const BasicTheme = lazy(() => import('./themes/BasicTheme').then(m => ({ default: m.default })));
const EdgeTheme = lazy(() => import('./themes/EdgeTheme').then(m => ({ default: m.default })));
const RoundedTheme = lazy(() => import('./themes/RoundedTheme').then(m => ({ default: m.default })));

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

      // alert('Generating contact with photo...');
      
      const vCardBlob = await generateVCard(profileData);
      
      
      // Create a more descriptive filename
      const cleanName = (profileData.fullname || profileData.username || 'contact')
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .trim();
      
      saveAs(vCardBlob, `${cleanName}.vcf`);
      
      // Show success message
      // alert('Contact saved successfully with photo!');
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


  // Render profile content based on theme
  const renderProfileContent = (theme: string, onUpdateVisitCount: (pk: string | number) => Promise<void>) => {
    const commonProps = {
      profileData: profileData!,
      onUpdateVisitCount,
      handleSaveContact
    };

    switch (theme) {
      case 'edge':
        return <EdgeTheme {...commonProps} />;
      case 'basic':
        return <BasicTheme {...commonProps} />;
      case 'rounded':
        return <RoundedTheme {...commonProps} />;
      default:
        return <BasicTheme {...commonProps} />;
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
      {!isAccountLocked && profileData && (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          {renderProfileContent(theme || 'basic', async (pk: string | number) => { await onUpdateVisitCount(pk || profileData.userPk); })}
        </Suspense>
      )}
      {isAccountLocked && profileData &&
        <>
        </>
      }
      {isAccountLocked && (
        <Suspense fallback={null}>
          <LockedAccountPopup
            isOpen={showPopup}
            onClose={handleClose}
          />
        </Suspense>
      )}
      {
        !isAccountLocked && profileData?.autoconnect && (
          <Suspense fallback={null}>
            <AutoConnectPopup
              isOpen={showAutoConnectPopup}
              onClose={handleCloseAutoConnectPopup}
              userPk={profileData.userPk}
            />
          </Suspense>
        )
      }
    </>
  );
}
