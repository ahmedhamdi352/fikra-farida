export const egyptCities = {
  Cairo: 'Cairo',
  Giza: 'Giza',
  Alexandria: 'Alexandria',
  'Al Qalyubiyah': 'Al Qalyubiyah',
  'Port Said': 'Port Said',
  'Al Minufiyah': 'Al Minufiyah',
  'Kafr Al Shaykh': 'Kafr Al Shaykh',
  'Al Gharbiyah': 'Al Gharbiyah',
  Suez: 'Suez',
  'Al Sharqiyah': 'Al Sharqiyah',
  'Al Buhairah': 'Al Buhairah',
  Ismailia: 'Ismailia',
  'Al Dakhliyah': 'Al Dakhliyah',
  Damietta: 'Damietta',
  Sohag: 'Sohag',
  Fayoum: 'Fayoum',
  Minya: 'Minya',
  'Beni Suef': 'Beni Suef',
  Asyut: 'Asyut',
  'Al Saha': 'Al Sahal',
  'Sharm El Sheikh': 'Sharm El Sheikh',
  'North Sinai': 'North Sinai',
  Qena: 'Qena',
  Aswan: 'Aswan',
  'Al Wadi Al Jadid': 'Al Wadi Al Jadid',
  'Red Sea': 'Red Sea',
  Luxor: 'Luxor',
  'South Sinai': 'South Sinai',
  Matroouh: 'Matroouh',
} as const;

export type EgyptCity = keyof typeof egyptCities;

// Helper function to get all city names
export const getCityNames = () => Object.keys(egyptCities);
