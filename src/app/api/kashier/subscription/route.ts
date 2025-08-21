import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { storeUserToken } from 'utils/tokenStorage';

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
    const requestBody = await request.json();
    const { amount, currency, orderId, email, firstName, userToken } = requestBody;

    console.log('Subscription API - Full request body:', JSON.stringify(requestBody, null, 2));
    console.log('Subscription API - Extracted fields:', { amount, currency, orderId, email, firstName, userToken: userToken ? 'TOKEN_PROVIDED' : 'NO_TOKEN' });

    // Store user token for webhook use
    if (userToken) {
      storeUserToken(orderId, userToken);
      console.log(`✅ Successfully stored user token for order: ${orderId}`);
    } else {
      console.warn(`⚠️ No user token provided for order: ${orderId} - webhook authentication will fail`);
    }

    // Check which fields are missing
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!currency) missingFields.push('currency');
    if (!orderId) missingFields.push('orderId');
    if (!email) missingFields.push('email');
    if (!firstName) missingFields.push('firstName');

    if (missingFields.length > 0) {
      console.error('Subscription API - Missing fields:', missingFields);
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          received: requestBody,
          missingFields
        },
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
    redirectUrl.searchParams.append('amount', amount.toString());
    redirectUrl.searchParams.append('currency', currency);
    redirectUrl.searchParams.append('hash', hash);
    redirectUrl.searchParams.append('mode', 'test');
    redirectUrl.searchParams.append('display', 'en');
    redirectUrl.searchParams.append('allowedMethods', 'card,wallet');
    redirectUrl.searchParams.append('brandColor', '#fec400');
    redirectUrl.searchParams.append('merchantRedirect', `${BASE_URL}/subscription/status`);
    redirectUrl.searchParams.append('serverWebhook', `${BASE_URL}/api/kashier/subscription-webhook`);

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
