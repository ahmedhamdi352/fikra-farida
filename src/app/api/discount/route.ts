import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Forward the request to the actual API
    const response = await fetch(`${baseUrl}/api/Store/ApplyDiscount?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Priority': 'u=1, i',
        'authority': 'www.fikrafarida.com',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error', isValid: false }, { status: 500 });
  }
}
