import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const KASHIER_WEBHOOK_SECRET = process.env.KASHIER_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!KASHIER_WEBHOOK_SECRET) {
    console.error('CRITICAL_ERROR: KASHIER_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-kashier-signature');

    // =================================================================
    // START: TEMPORARY DEBUG LOGGING
    // This will log the exact data we need to solve the signature issue.
    // =================================================================
    console.log('--- KASHIER WEBHOOK DEBUG START ---');
    console.log(`Received Signature: ${signature}`);
    console.log(`Received Raw Body: ${rawBody}`);
    console.log('--- KASHIER WEBHOOK DEBUG END ---');
    // =================================================================
    // END: TEMPORARY DEBUG LOGGING
    // =================================================================

    if (!signature) {
      console.warn("Webhook received without 'x-kashier-signature' header.");
      return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
    }

    const expectedSignature = crypto.createHmac('sha256', KASHIER_WEBHOOK_SECRET).update(rawBody).digest('hex');

    // Log the signature we calculated for comparison
    console.log(`Calculated Signature: ${expectedSignature}`);

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature. Request may be fraudulent.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    console.log(
      JSON.stringify({
        logType: 'KASHIER_WEBHOOK_VALIDATED',
        eventType: event.type,
        orderId: event.data?.orderId,
        paymentStatus: event.data?.status,
        timestamp: new Date().toISOString(),
      })
    );

    const { orderId, status } = event.data;

    switch (status) {
      case 'SUCCESS':
        console.log(`Processing SUCCESS for orderId: ${orderId}`);
        break;
      case 'FAILED':
        console.log(`Processing FAILED for orderId: ${orderId}`);
        break;
      case 'PENDING':
        console.log(`Processing PENDING for orderId: ${orderId}`);
        break;
      default:
        console.info(`Received unhandled payment status: '${status}' for orderId: ${orderId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unhandled error in Kashier webhook processing:', message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
