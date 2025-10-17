import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const KASHIER_WEBHOOK_SECRET = process.env.KASHIER_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!KASHIER_WEBHOOK_SECRET) {
      console.error('KASHIER_API_KEY environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const signature = request.headers.get('x-kashier-signature');

    if (!signature) {
      console.warn("Subscription webhook received without 'x-kashier-signature' header.");
      return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
    }

    const event = await request.json();
    const { data } = event;
    const { signatureKeys } = data;

    if (!signatureKeys || !Array.isArray(signatureKeys)) {
      console.error("Invalid subscription webhook payload: 'signatureKeys' array is missing.");
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
      console.error('Invalid subscription webhook signature. Request may be fraudulent.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }


    // Extract payment details - merchantOrderId now contains the user token
    const { merchantOrderId, status } = data;
    const userToken = merchantOrderId; // Token is sent as orderId from frontend

    switch (status) {
      case 'SUCCESS':
        try {
          // Use token from Kashier webhook data
          if (!userToken) {
            console.error('Subscription activation failed - missing authentication token in webhook');
            break;
          }

          // Update subscription with payment details
          const subscriptionPayload = {
            CountryCode: 'EG',
            Domain: 'fikrafarida.com',
            DaysToAdd: (data.amount === '449' || data.amount === 449) ? 365 : 30,
            PaymentAmount: Number(data.amount),
            Currency: 'EGP',
            PaymentOperationId: merchantOrderId,
          };

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Account/Subscribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: userToken,
            },
            body: JSON.stringify(subscriptionPayload),
          });

          if (response.ok) {
          } else {
            console.error(
              `Failed to activate subscription ${merchantOrderId}: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Failed to activate subscription ${merchantOrderId}:`, error);
        }
        break;
      case 'FAILED':
        try {
          // Update subscription status to failed
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Account/Subscribe/${merchantOrderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'failed',
              paymentStatus: 'failed',
            }),
          });

          if (response.ok) {
          } else {
            console.error(
              `Failed to update subscription ${merchantOrderId}: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Failed to update subscription ${merchantOrderId}:`, error);
        }
        break;
      case 'PENDING':
        try {
          // Update subscription status to pending
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Account/Subscribe/${merchantOrderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'pending',
              paymentStatus: 'pending',
            }),
          });

          if (response.ok) {
          } else {
            console.error(
              `Failed to update subscription ${merchantOrderId}: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Failed to update subscription ${merchantOrderId}:`, error);
        }
        break;
      default:
        console.info(`Received unhandled subscription payment status: '${status}' for orderId: ${merchantOrderId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Subscription webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
