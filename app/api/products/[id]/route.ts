// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id] — public
export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PATCH /api/products/[id] — admin only
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const body = await req.json();
    if (body.stock !== undefined) body.available = Number(body.stock) > 0;

    const updated = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PATCH /api/products/id]', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}