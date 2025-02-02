import { NextResponse } from 'next/server';
import { getUserCountry } from 'utils/country';

// Mark this file as server-only to prevent client-side imports
export const runtime = 'edge';

export async function GET() {
  const countryCode = await getUserCountry();
  return NextResponse.json({ countryCode });
}
