import { type EgyptCity } from './cities';

interface ShippingZoneData {
  name: string;
  price: number;
  cities: EgyptCity[];
}

// Define shipping zones with their respective prices
export const shippingZones = {
  zone1: {
    name: 'Cairo & Giza Area',
    price: 55,
    cities: ['Cairo', 'Giza', 'Alexandria'] as EgyptCity[],
  },

  zone2: {
    name: 'Delta Cities',
    price: 70,
    cities: [
      'Al Qalyubiyah',
      'Port Said',
      'Al Minufiyah',
      'Kafr Al Shaykh',
      'Al Gharbiyah',
      'Suez',
      'Al Sharqiyah',
      'Al Buhairah',
      'Ismailia',
      'Al Dakhliyah',
      'Damietta',
    ] as EgyptCity[],
  },
  zone3: {
    name: 'Upper Egypt',
    price: 80,
    cities: ['Sohag', 'Fayoum', 'Minya', 'Beni Suef', 'Asyut'] as EgyptCity[],
  },
  zone4: {
    name: 'Canal Cities',
    price: 95,
    cities: ['Al Saha', 'Sharm El Sheikh'] as EgyptCity[],
  },
  zone5: {
    name: 'Remote Cities',
    price: 120,
    cities: ['North Sinai', 'Qena', 'Al Wadi Al Jadid', 'Red Sea', 'Luxor', 'South Sinai', 'Matroouh'] as EgyptCity[],
  },
} as const satisfies Record<string, ShippingZoneData>;

export type ShippingZone = keyof typeof shippingZones;

// Helper function to get shipping price for a city
export const getShippingPrice = (city: EgyptCity): number => {
  for (const zone of Object.values(shippingZones)) {
    if (zone.cities.includes(city)) {
      return zone.price;
    }
  }
  return 120; // Default price for unlisted cities
};

// Helper function to get zone name for a city
export const getZoneName = (city: EgyptCity): string => {
  for (const zone of Object.values(shippingZones)) {
    if (zone.cities.includes(city)) {
      return zone.name;
    }
  }
  return 'Remote Cities';
};

// Helper function to get zone information for a city
export const getZoneInfo = (city: EgyptCity) => {
  for (const zone of Object.values(shippingZones)) {
    if (zone.cities.includes(city)) {
      return {
        zoneName: zone.name,
        price: zone.price,
      };
    }
  }

  return {
    zoneName: 'Remote Cities',
    price: 120,
  };
};
