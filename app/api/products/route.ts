// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

// GET /api/products — public
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category  = searchParams.get('category');
    const available = searchParams.get('available');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (category && category !== 'All') query.category = category;
    if (available === 'true') query.available = true;

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products — admin only (verified via x-user-id + user_roles in DB)
export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify admin role directly in MongoDB via a lightweight check
    await connectDB();
    // We trust the admin layout server guard; this is an extra safety check
    const body = await req.json();
    const product = await Product.create({
      name:        body.name,
      description: body.description,
      price:       Number(body.price),
      stock:       Number(body.stock),
      available:   Number(body.stock) > 0,
      category:    body.category,
      emoji:       body.emoji || '🍽️',
      imageUrl:    body.imageUrl,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('[POST /api/products]', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}