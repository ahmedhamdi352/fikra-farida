import { SiteData } from 'services/api.service';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const MEDIA_URL = 'https://fikrafarida.com/media/site/';

export async function getSiteData(countryCode: string = 'EG', domain: string = 'fikrafarida.com'): Promise<SiteData> {
  if (!BASE_URL) {
    throw new Error('API URL is not configured');
  }

  // Create query params
  const params = new URLSearchParams({
    CountryCode: countryCode,
    domain: domain,
  });

  const url = `${BASE_URL}/endpoint/api/Store/SiteData?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.statusText}`);
    }

    const data = await response.json();

    // Add media URL prefix to all media fields
    const transformedData = {
      ...data,
      siteLogo: data.siteLogo ? `${MEDIA_URL}${data.siteLogo}` : data.siteLogo,
      reviewMedia1: data.reviewMedia1 ? `${MEDIA_URL}${data.reviewMedia1}` : data.reviewMedia1,
      reviewMedia2: data.reviewMedia2 ? `${MEDIA_URL}${data.reviewMedia2}` : data.reviewMedia2,
      reviewMedia3: data.reviewMedia3 ? `${MEDIA_URL}${data.reviewMedia3}` : data.reviewMedia3,
      reviewMedia4: data.reviewMedia4 ? `${MEDIA_URL}${data.reviewMedia4}` : data.reviewMedia4,
      reviewMedia5: data.reviewMedia5 ? `${MEDIA_URL}${data.reviewMedia5}` : data.reviewMedia5,
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching site data:', error);
    throw error;
  }
}
