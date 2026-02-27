// app/admin/products/page.tsx
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { AdminProductsClient } from './AdminProductsClient';
import type { Product as IProduct } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  const serialized: IProduct[] = JSON.parse(JSON.stringify(products));
  return <AdminProductsClient initialProducts={serialized} />;
}
