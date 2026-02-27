// app/admin/page.tsx
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  await connectDB();
  const [totalProducts, inStock, outOfStock, recentProducts, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ available: true }),
    Product.countDocuments({ available: false }),
    Product.find().sort({ createdAt: -1 }).limit(5).lean(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const inventoryValue = (await Product.find({ available: true }).lean()).reduce(
    (s, p) => s + p.price * p.stock, 0
  );

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: '📦' },
    { label: 'In Stock', value: inStock, icon: '✅' },
    { label: 'Out of Stock', value: outOfStock, icon: '🚫' },
    { label: 'Inventory Value', value: `	₦${inventoryValue.toFixed(0)}`, icon: '💰' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--brown-600)] text-sm">Overview of your store</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--warm-white)] border border-[var(--border)] rounded-xl p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-serif text-2xl font-bold text-[var(--amber)]">{s.value}</div>
            <div className="text-xs text-[var(--brown-600)] font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-[var(--warm-white)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="font-serif font-bold mb-4">Recent Products</h2>
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recentProducts.map((p: any) => (
              <div key={p._id} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.name}</div>
                  <div className="text-xs text-[var(--brown-600)]">{p.category}</div>
                </div>
                <div className="font-bold text-[var(--amber)] text-sm">	₦{p.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[var(--warm-white)] border border-[var(--border)] rounded-xl p-5">
          <h2 className="font-serif font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.length === 0 && <p className="text-sm text-[var(--brown-600)]">No orders yet.</p>}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recentOrders.map((o: any) => (
              <div key={o._id} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">#{String(o._id).slice(-8).toUpperCase()}</div>
                  <div className="text-xs text-[var(--brown-600)]">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="font-bold text-[var(--amber)] text-sm">	₦{o.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
