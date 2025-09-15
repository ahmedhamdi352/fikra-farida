import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const MERCHANT_ID = process.env.KASHIER_MERCHANT_ID!;
const API_KEY = process.env.KASHIER_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

if (!MERCHANT_ID || !API_KEY || !BASE_URL) {
  throw new Error(
    'Environment variables KASHIER_MERCHANT_ID, KASHIER_API_KEY, and NEXT_PUBLIC_BASE_URL must be defined.'
  );
}

function generateKashierOrderHash(merchantId: string, orderId: string, amount: number, currency: string) {
  const path = `/?payment=${merchantId}.${orderId}.${amount}.${currency}`;
  return crypto.createHmac('sha256', API_KEY).update(path).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, orderId, email, firstName, lastName, id } = await request.json();

    if (!amount || !currency || !orderId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, orderId, email, firstName, lastName, id' },
        { status: 400 }
      );
    }

    // Convert amount to integer (amount in cents/piasters)
    // const amountInPiasters = Math.round(parseFloat(amount) * 100);

    // Generate hash using Kashier's format
    const hash = generateKashierOrderHash(MERCHANT_ID, orderId, amount, currency);

    // Create redirect URLs with proper encoding
    // const successUrl = new URL('/payment/status', BASE_URL);
    // const failureUrl = new URL('/payment/status', BASE_URL);
    // const cancelUrl = new URL('/payment/status', BASE_URL);

    // Add status parameters
    // successUrl.searchParams.append('paymentStatus', 'SUCCESS');
    // failureUrl.searchParams.append('paymentStatus', 'FAILED');
    // cancelUrl.searchParams.append('paymentStatus', 'CANCELLED');

    // Construct the Kashier redirect URL
    const redirectUrl = new URL('https://checkout.kashier.io');

    // Add required parameters
    redirectUrl.searchParams.append('merchantId', MERCHANT_ID);
    redirectUrl.searchParams.append('orderId', orderId);
    redirectUrl.searchParams.append('id', id);
    redirectUrl.searchParams.append('amount', amount.toString());
    redirectUrl.searchParams.append('currency', currency);
    redirectUrl.searchParams.append('hash', hash);
    redirectUrl.searchParams.append('mode', 'test');
    redirectUrl.searchParams.append('display', 'en');
    redirectUrl.searchParams.append('allowedMethods', 'card,wallet');
    redirectUrl.searchParams.append('brandColor', '#fec400');
    redirectUrl.searchParams.append('merchantRedirect', `${BASE_URL}/payment/status`);
    redirectUrl.searchParams.append('serverWebhook', `${BASE_URL}/api/kashier/webhook`);

    // Return the redirect URL
    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl.toString(),
    });
  } catch (error) {
    console.error('Payment error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
