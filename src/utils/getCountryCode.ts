export const getCountryCode = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code.toLowerCase();
  } catch (error) {
    console.error('Error fetching country code:', error);
    return 'ae';
  }
};
