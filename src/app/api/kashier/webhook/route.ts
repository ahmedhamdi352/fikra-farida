import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const KASHIER_WEBHOOK_SECRET = process.env.KASHIER_WEBHOOK_SECRET;

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

    // For Kashier's specific method, we must parse the body first
    // to access the `signatureKeys` array.
    const event = await request.json();
    const { data } = event; // The `hash` in the body is for the payment, not the webhook.
    const { signatureKeys } = data;

    if (!signatureKeys || !Array.isArray(signatureKeys)) {
      console.error("Invalid webhook payload: 'signatureKeys' array is missing.");
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    // --- THIS IS THE CRITICAL FIX ---
    // Rebuild the string that Kashier signed by concatenating the values
    // of the keys in the order specified by the `signatureKeys` array.
    let stringToSign = '';
    for (const key of signatureKeys) {
      if (data[key] !== undefined) {
        stringToSign += data[key];
      }
    }

    // Now, create the expected signature using the newly constructed string.
    const expectedSignature = crypto.createHmac('sha256', KASHIER_WEBHOOK_SECRET).update(stringToSign).digest('hex');

    // Log for debugging
    console.log(`String Used for Hashing: "${stringToSign}"`);
    console.log(`Received Signature: ${signature}`);
    console.log(`Calculated Signature: ${expectedSignature}`);

    // Securely compare the signatures.
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature. Request may be fraudulent.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // --- SIGNATURE IS NOW VALID ---
    console.log(
      JSON.stringify({
        logType: 'KASHIER_WEBHOOK_VALIDATED',
        eventType: event.event, // The event type is at the top level
        orderId: data.merchantOrderId,
        paymentStatus: data.status,
        timestamp: new Date().toISOString(),
      })
    );

    // --- Business Logic ---
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
