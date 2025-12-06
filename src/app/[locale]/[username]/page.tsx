import { Metadata } from 'next';
import ClientWrapper from './components/ClientWrapper';
import type { Viewport } from 'next';
import { ProfileForReadDTO } from 'types';
// interface UsernameProps {
//   params: { locale: string; username: string };
// }

interface UsernameProps {
  params: Promise<{ locale: string; username: string }>;
}

type ProfileResponse = {
  success?: boolean;
  sucess?: boolean; // Handle both spellings (API might use 'sucess' instead of 'success')
  data?: ProfileForReadDTO | { sucess: boolean; errorcode: number; message: string };
  message?: string;
  errorCode?: number;
  errorcode?: number; // Handle both spellings
};

export async function generateViewport(): Promise<Viewport> {

  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#FFFFFF',
  };
}

async function getProfileByUsername(username: string): Promise<ProfileResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fikrafarida.com';
  const url = `${baseUrl}/api/Account/ProfileByName?username=${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching to always get fresh data
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorBody.message || `Network Error: ${response.status} ${response.statusText}`,
        errorCode: errorBody.errorCode || errorBody.errorcode || response.status,
      };
    }

    const apiResponseData = await response.json();

    // 3. Critically, examine the 'success' flag (or 'sucess') from the API's JSON payload
    // This is where your API indicates logical success/failure
    if (apiResponseData) {
      // API indicates logical success: Return the data as-is if successful
      return {
        success: true,
        data: apiResponseData, // This 'data' property holds ProfileForReadDTO
      };
    }
    else {
      return {
        success: false,
        message: 'Failed to fetch profile data',
        errorCode: 500,
      };
    }

  } catch (error) {
    console.error('Error fetching profile data:', error);
    return { success: false, message: 'Failed to fetch profile data', errorCode: 500 };
  }
}

export async function generateMetadata({ params }: UsernameProps): Promise<Metadata> {
  const { locale, username } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fikrafarida.com';
  const profileUrl = `${siteUrl}/${locale}/${username}`;

  // Try to get profile data for better metadata
  try {
    const profileData = await getProfileByUsername(username);
    if (profileData.success && profileData.data) {
      if (typeof profileData.data === 'object' && 'fullname' in profileData.data) {
        const fullName = profileData.data.fullname || username;
        const bio = profileData.data.bio || `View ${fullName}'s digital business card and contact information`;
        const profileImage = profileData.data.imageFilename 
          ? `https://fikrafarida.com/Media/Profiles/${profileData.data.imageFilename}`
          : `${siteUrl}/icons/icon-512x512.png`;

        return {
          title: `${fullName}'s Profile`,
          description: bio,
          alternates: {
            canonical: profileUrl,
          },
          openGraph: {
            type: 'profile',
            url: profileUrl,
            title: `${fullName}'s Digital Business Card`,
            description: bio,
            images: [
              {
                url: profileImage,
                width: 1200,
                height: 630,
                alt: `${fullName}'s profile`,
              },
            ],
          },
          twitter: {
            card: 'summary_large_image',
            title: `${fullName}'s Digital Business Card`,
            description: bio,
            images: [profileImage],
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: `${username}'s Profile`,
    description: `View ${username}'s digital business card and contact information`,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      type: 'profile',
      url: profileUrl,
      title: `${username}'s Digital Business Card`,
      description: `View ${username}'s digital business card and contact information`,
      images: [
        {
          url: `${siteUrl}/icons/icon-512x512.png`,
          width: 1200,
          height: 630,
          alt: `${username}'s profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${username}'s Digital Business Card`,
      description: `View ${username}'s digital business card and contact information`,
      images: [`${siteUrl}/icons/icon-512x512.png`],
    },
  };
}

export default async function UsernamePage({ params }: UsernameProps) {
  const { username } = await params;

  const profileData = await getProfileByUsername(username);

  const isAccountLocked = !(typeof profileData.data === 'object' && 'fullname' in profileData.data) ? (profileData?.data?.errorcode === 408 || profileData?.data?.sucess === false) : false;


  const theme = (typeof profileData.data === 'object' && 'fullname' in profileData.data) ? profileData.data?.theme : 'basic';
  return (
    <div className="relative md:pb-10 ">
      <ClientWrapper
        isAccountLocked={isAccountLocked}
        profileData={typeof profileData.data === 'object' && 'fullname' in profileData.data ? profileData.data : undefined}
        theme={theme.length > 0 ? theme : 'basic'}
      />
    </div>
  );
}
