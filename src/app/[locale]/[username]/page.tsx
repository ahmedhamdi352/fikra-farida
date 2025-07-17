// import { Metadata } from 'next';
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
  data?: ProfileForReadDTO; // Replace with proper type when available
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

export async function generateMetadata({ params }: UsernameProps) {
  const { username } = await params;

  // Try to get profile data for better metadata
  try {
    const profileData = await getProfileByUsername(username);
    if (profileData.success && profileData.data) {
      return {
        title: `${profileData.data.fullname || username}'s Profile`,
        description: `View ${profileData.data.fullname || username}'s profile page`,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: `${username}'s Profile`,
    description: `View ${username}'s profile page`,
  };
}

export default async function UsernamePage({ params }: UsernameProps) {
  const { username } = await params;

  const profileData = await getProfileByUsername(username);

  const isAccountLocked = (profileData.errorcode === 408 || profileData.sucess === false);

  const theme = profileData.data?.theme || 'premium';


  return (
    <div className="relative">
      <ClientWrapper
        isAccountLocked={isAccountLocked}
        profileData={profileData.data}
        theme={theme}
      />
    </div>
  );
}
