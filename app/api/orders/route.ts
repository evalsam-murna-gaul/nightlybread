// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Cart } from '@/models/Cart';
import { DELIVERY_FEE } from '@/types';

// GET /api/orders — get current user's orders
export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (err) {
    console.error('[GET /api/orders]', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — place an order from current cart
export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    const sessionId = req.headers.get('x-session-id');

    await connectDB();

    const cartQuery = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(cartQuery);

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subtotal = cart.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const total = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      userId: userId ?? sessionId ?? 'guest',
      items: cart.items,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
    });

    cart.items = [];
    await cart.save();

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}