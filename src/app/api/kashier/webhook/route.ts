import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Ensure this is your "Webhook Secret Key" from the Kashier dashboard, not the API key.
const KASHIER_WEBHOOK_SECRET = process.env.KASHIER_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // 1. Verify the secret is configured on the server.
  if (!KASHIER_WEBHOOK_SECRET) {
    console.error('CRITICAL_ERROR: KASHIER_WEBHOOK_SECRET is not set in environment variables.');
    return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
  }

  try {
    // 2. Get the RAW text of the request body for signature verification.
    // This is the most important fix.
    const rawBody = await request.text();

    // 3. Get the signature from the request headers.
    const signature = request.headers.get('x-kashier-signature');
    if (!signature) {
      console.warn("Webhook received without 'x-kashier-signature' header.");
      return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
    }

    // 4. Calculate the expected signature using the raw body.
    const expectedSignature = crypto
      .createHmac('sha256', KASHIER_WEBHOOK_SECRET)
      .update(rawBody) // Use the raw text body here.
      .digest('hex');

    // 5. Securely compare the signatures.
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature. Request may be fraudulent.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 6. Signature is valid! Now parse the JSON to use its content.
    const event = JSON.parse(rawBody);

    // --- Structured Logging for Vercel ---
    // This makes it easy to search and filter your logs.
    console.log(
      JSON.stringify(
        {
          logType: 'KASHIER_WEBHOOK_VALIDATED',
          eventType: event.type,
          orderId: event.data?.orderId,
          paymentStatus: event.data?.status,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    // --- Business Logic ---
    const { orderId, status } = event.data;

    switch (status) {
      case 'SUCCESS':
        // TODO: Add your logic for a successful payment.
        // - Find order in DB using `orderId`.
        // - Check if already paid (idempotency).
        // - Update status to 'paid'.
        // - Grant access to service/product.
        console.log(`Processing SUCCESS for orderId: ${orderId}`);
        break;

      case 'FAILED':
        // TODO: Add your logic for a failed payment.
        // - Find order in DB using `orderId`.
        // - Update status to 'failed'.
        console.log(`Processing FAILED for orderId: ${orderId}`);
        break;

      case 'PENDING':
        // No action is usually needed for pending status.
        console.log(`Processing PENDING for orderId: ${orderId}`);
        break;

      default:
        console.info(`Received unhandled payment status: '${status}' for orderId: ${orderId}`);
    }

    // 7. Acknowledge receipt of the webhook.
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unhandled error in Kashier webhook processing:', message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
