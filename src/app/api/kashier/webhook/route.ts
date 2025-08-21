import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const KASHIER_WEBHOOK_SECRET = process.env.KASHIER_API_KEY;

export async function POST(request: NextRequest) {
  if (!KASHIER_WEBHOOK_SECRET) {
    console.error('CRITICAL_ERROR: KASHIER_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
  }

  try {
    const signature = request.headers.get('x-kashier-signature');
    if (!signature) {
      console.warn("Webhook received without 'x-kashier-signature' header.");
      return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
    }

    const event = await request.json();
    const { data } = event;
    const { signatureKeys } = data;

    if (!signatureKeys || !Array.isArray(signatureKeys)) {
      console.error("Invalid webhook payload: 'signatureKeys' array is missing.");
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    const pairsToSign = [];
    for (const key of signatureKeys) {
      if (data[key] !== undefined) {
        const encodedValue = encodeURIComponent(data[key]);
        pairsToSign.push(`${key}=${encodedValue}`);
      }
    }
    const stringToSign = pairsToSign.join('&');

    const encodedString = encodeURIComponent(stringToSign);

    const expectedSignature = crypto.createHmac('sha256', KASHIER_WEBHOOK_SECRET).update(encodedString).digest('hex');

    console.log(`String Used for Hashing: "${stringToSign}"`);
    console.log(`Received Signature: ${signature}`);
    console.log(`Calculated Signature: ${expectedSignature}`);

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature. Request may be fraudulent.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log(
      JSON.stringify({
        logType: 'KASHIER_WEBHOOK_VALIDATED',
        eventType: event.event,
        orderId: data.merchantOrderId,
        paymentStatus: data.status,
        timestamp: new Date().toISOString(),
      })
    );

    const { merchantOrderId, status } = data;

    switch (status) {
      case 'SUCCESS':
        console.log(`Processing SUCCESS for orderId: ${merchantOrderId}`);
        localStorage.removeItem('fikra-farida-cart');
        break;
      case 'FAILED':
        console.log(`Processing FAILED for orderId: ${merchantOrderId}`);
        break;
      case 'PENDING':
        console.log(`Processing PENDING for orderId: ${merchantOrderId}`);
        break;
      default:
        console.info(`Received unhandled payment status: '${status}' for orderId: ${merchantOrderId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unhandled error in Kashier webhook processing:', message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
