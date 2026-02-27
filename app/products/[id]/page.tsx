// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductDetailClient } from './ProductDetailClient';
import type { Product as IProduct } from '@/types';

export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<IProduct | null> {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
