import { redirect, notFound } from 'next/navigation';
import { ApiURLs } from 'api/core';
import ProfilePreview from './components/ProfilePreview';

// Server component to fetch profile data by QR code key
async function getProfileByKey(key: string) {
  try {
    // Using fetch API for server-side data fetching with API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined in environment variables');
    }

    const response = await fetch(`${apiUrl}${ApiURLs.myProfileByKey}?key=${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Prevent stale data with Next.js cache control
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile by key:', error);
    throw error;
  }
}

// Define the correct types for Next.js page props
interface QrPageProps {
  params: Promise<{ locale: string; key: string }>;
}

export default async function QrPage({ params }: QrPageProps) {
  // Await params as required by the app's configuration
  const resolvedParams = await params;
  const { key } = resolvedParams;

  let profileData;

  try {
    profileData = await getProfileByKey(key);
    console.log(profileData);
  } catch (error: unknown) {
    console.error('Error fetching profile data:', error);
    return notFound();
  }

  // Handle error codes with appropriate redirects
  if (profileData.errorcode === 406) {
    // Redirect to active products page with QR key as search param for activation
    // This allows the active products page to use the key for API calls
    return redirect(`/active-products?key=${key}`);
  } else if (profileData.errorcode === 408) {
    // Account is locked - show profile with locked indicator
    console.log('Account is locked:', profileData.message);
    // Mark profile as locked for UI indication
    profileData.isLocked = true;
  } else if (profileData.errorcode === 407 || (!profileData.sucess && !profileData.success)) {
    // QR Not Found or general failure - show 404 page
    console.error('QR not found or invalid:', profileData.message);
    return notFound();
  }

  // Server-side rendering of the profile preview
  return (
    <div className="w-full min-h-screen py-8 px-4">
      <ProfilePreview profileData={profileData} />
    </div>
  );
}
