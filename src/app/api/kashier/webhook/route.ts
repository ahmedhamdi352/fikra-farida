import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const API_KEY = process.env.KASHIER_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature
    const signature = request.headers.get('x-kashier-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Calculate expected signature
    const payload = JSON.stringify(body);
    const expectedSignature = crypto
      .createHmac('sha256', API_KEY)
      .update(payload)
      .digest('hex');

    // Verify signature
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle different payment statuses
    const { status, orderId, amount, currency } = body;

    // Log payment status
    console.log('Payment webhook received:', {
      status,
      orderId,
      amount: amount / 100, // Convert back from piasters to main currency
      currency,
    });

    // Here you can update your database or perform other actions based on the payment status
    switch (status) {
      case 'SUCCESS':
        // Payment successful
        break;
      case 'FAILED':
        // Payment failed
        break;
      case 'PENDING':
        // Payment pending
        break;
      default:
        console.log('Unknown payment status:', status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
