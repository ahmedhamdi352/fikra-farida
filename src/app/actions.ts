import { SiteData } from 'services/api.service';
import { Product } from 'types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const MEDIA_URL = 'https://fikrafarida.com/media/site/';
const PRODUCT_MEDIA_URL = 'https://fikrafarida.com/Media/Products/';

async function getUserCountry(): Promise<string> {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const response = await fetch(`${origin}/api/country`);
    const data = await response.json();
    return data.countryCode;
  } catch (error) {
    console.error('Error detecting country:', error);
    return 'EG';
  }
}

export async function getSiteData(countryCode?: string, domain: string = 'fikrafarida.com'): Promise<SiteData> {
  if (!BASE_URL) {
    throw new Error('API URL is not configured');
  }

  const effectiveCountryCode: string = countryCode || (await getUserCountry());

  const params = new URLSearchParams({
    CountryCode: effectiveCountryCode,
    domain,
  } as Record<string, string>);

  const url = `${BASE_URL}/api/Store/SiteData?${params.toString()}`;

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

export async function getProducts(countryCode?: string): Promise<Product[]> {
  if (!BASE_URL) {
    throw new Error('API URL is not configured');
  }

  const effectiveCountryCode: string = countryCode || (await getUserCountry());

  const params = new URLSearchParams({
    CountryCode: effectiveCountryCode,
  } as Record<string, string>);

  const url = `${BASE_URL}/api/Store/Products?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'https://www.fikrafarida.com',
        Referer: 'https://www.fikrafarida.com/',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the Media URLs
    return data
      .map((product: Product) => ({
        ...product,
        Media: product.Media.map(media => `${PRODUCT_MEDIA_URL}${media}`),
        colors: product.colors.map(color => ({
          ...color,
          Media: color.Media.map(media => `${PRODUCT_MEDIA_URL}${media}`),
        })),
      }))
      .sort((a: Product, b: Product) => {
        const rankA = a.rank ?? Number.MAX_VALUE;
        const rankB = b.rank ?? Number.MAX_VALUE;
        return rankA - rankB;
      });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
