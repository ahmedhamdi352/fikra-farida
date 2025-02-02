import { headers } from 'next/headers';

export async function getUserCountry(): Promise<string> {
  try {
    const headersList = headers();
    const ip = (await headersList).get('x-forwarded-for') || '8.8.8.8';

    // Skip IP lookup for local development IPs
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      console.log('Local development IP detected:', ip);
      return 'EG'; // Default for local development
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    console.log('IP Lookup Response:', { data });

    // Check if we got an error response
    if (data.error || !data.country_code) {
      console.error('IP lookup error or missing country code:', data);
      return 'EG';
    }

    // Return the country code directly from the API
    return data.country_code;
  } catch (error) {
    console.error('Error detecting country:', error);
    return 'EG';
  }
}
