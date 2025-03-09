import { type EgyptCity } from './cities';

interface ShippingZoneData {
  name: string;
  price: number;
  cities: EgyptCity[];
}

// Define shipping zones with their respective prices
export const shippingZones = {
  zone1: {
    name: 'Cairo & Giza',
    price: 50,
    cities: ['Cairo', 'Giza', 'Helwan', '6th of October City', 'Sheikh Zayed City', 'New Cairo'] as EgyptCity[],
  },
  zone2: {
    name: 'Greater Cairo & Delta',
    price: 75,
    cities: [
      'Alexandria',
      'Shubra El Kheima',
      'Tanta',
      'Mansoura',
      'Zagazig',
      'Damietta',
      'Kafr El Sheikh',
      'Port Said',
      'Ismailia',
      'Suez',
      'Banha',
      'Shibin El Kom',
      'Badr City',
      'Obour City',
      '10th of Ramadan City',
      'Sadat City',
    ] as EgyptCity[],
  },
  zone3: {
    name: 'Upper Egypt & Remote Areas',
    price: 100,
    cities: [
      'Luxor',
      'Aswan',
      'Asyut',
      'Fayoum',
      'Minya',
      'Beni Suef',
      'Qena',
      'Sohag',
      'Hurghada',
      'Arish',
      'Marsa Matruh',
    ] as EgyptCity[],
  },
} as const satisfies Record<string, ShippingZoneData>;

export type ShippingZone = keyof typeof shippingZones;

// Helper function to get shipping price for a city
export const getShippingPrice = (city: EgyptCity): number => {
  // Find the zone that contains the city
  const zone = Object.values(shippingZones).find(zone => zone.cities.includes(city));

  // Return the zone price or a default price if city not found in any zone
  return zone?.price || 50;
};

// Helper function to get zone information for a city
export const getZoneInfo = (city: EgyptCity) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const zone = Object.entries(shippingZones).find(([_, zoneData]) => zoneData.cities.includes(city));

  if (!zone) {
    return {
      zoneName: 'Other Areas',
      price: 50,
    };
  }

  return {
    zoneName: zone[1].name,
    price: zone[1].price,
  };
};
