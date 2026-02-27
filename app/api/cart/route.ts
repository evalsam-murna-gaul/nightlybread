// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Cart } from '@/models/Cart';

function getIdentifiers(req: Request) {
  const userId = req.headers.get('x-user-id') ?? null;
  const sessionId = req.headers.get('x-session-id') ?? null;
  return { userId, sessionId };
}

async function findOrCreateCart(userId: string | null, sessionId: string | null) {
  if (userId) {
    return Cart.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, items: [] } },
      { upsert: true, returnDocument: 'after' }
    );
  }
  if (sessionId) {
    return Cart.findOneAndUpdate(
      { sessionId },
      { $setOnInsert: { sessionId, items: [] } },
      { upsert: true, returnDocument: 'after' }
    );
  }
  return null;
}

// GET /api/cart
export async function GET(req: Request) {
  try {
    await connectDB();
    const { userId, sessionId } = getIdentifiers(req);
    const cart = await findOrCreateCart(userId, sessionId);
    return NextResponse.json(cart ?? { items: [] });
  } catch (err) {
    console.error('[GET /api/cart]', err);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart — add or update item
export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, sessionId } = getIdentifiers(req);
    const { productId, name, price, emoji, quantity } = await req.json();

    const cart = await findOrCreateCart(userId, sessionId);
    if (!cart) return NextResponse.json({ error: 'No session' }, { status: 400 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = cart.items.find((i: any) => i.productId.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, emoji, quantity });
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (err) {
    console.error('[POST /api/cart]', err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart — clear cart or remove item
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { userId, sessionId } = getIdentifiers(req);
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const cart = await findOrCreateCart(userId, sessionId);
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    if (productId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cart.items = cart.items.filter((i: any) => i.productId.toString() !== productId);
    } else {
      cart.items = [];
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (err) {
    console.error('[DELETE /api/cart]', err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// PATCH /api/cart — update item quantity
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { userId, sessionId } = getIdentifiers(req);
    const { productId, quantity } = await req.json();

    const cart = await findOrCreateCart(userId, sessionId);
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = cart.items.find((i: any) => i.productId.toString() === productId);
    if (item) {
      if (quantity <= 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cart.items = cart.items.filter((i: any) => i.productId.toString() !== productId);
      } else {
        item.quantity = quantity;
      }
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (err) {
    console.error('[PATCH /api/cart]', err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}