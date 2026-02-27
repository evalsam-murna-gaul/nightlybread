// app/products/page.tsx
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductsClient } from './ProductsClient';
import type { Product as IProduct } from '@/types';

export const dynamic = 'force-dynamic';

async function getAllProducts(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <ProductsClient products={products} />;
}
