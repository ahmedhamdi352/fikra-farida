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

    const expectedSignature = crypto.createHmac('sha256', KASHIER_WEBHOOK_SECRET).update(stringToSign).digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature. Request may be fraudulent.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { merchantOrderId, status } = data;

    switch (status) {
      case 'SUCCESS':
        try {
          // Update order status to success
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/ShoppingOrder/update/${merchantOrderId}/status`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'success',
              }),
            }
          );

          if (response.ok) {
          } else {
            console.error(
              `Failed to update order ${merchantOrderId} status: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Failed to update order ${merchantOrderId} status:`, error);
        }
        break;
      case 'FAILED':
        try {
          // Update order status to failed
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/ShoppingOrder/update/${merchantOrderId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'failed',
              }),
            }
          );

          if (response.ok) {
          } else {
            console.error(
              `Failed to update order ${merchantOrderId} status: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Failed to update order ${merchantOrderId} status:`, error);
        }
        break;
      case 'PENDING':
        try {
          // Update order status to pending
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/ShoppingOrder/update/${merchantOrderId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'pending',
              }),
            }
          );

          if (response.ok) {
          } else {
            console.error(
              `Failed to update order ${merchantOrderId} status: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Failed to update order ${merchantOrderId} status:`, error);
        }
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
