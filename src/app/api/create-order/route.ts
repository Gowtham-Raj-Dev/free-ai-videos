import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { amount = 25, currency = 'INR' } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_T1ZGJz5iR0rxLf';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'ApJDK5UtcC5kmGKYcP3wjTEv';

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
