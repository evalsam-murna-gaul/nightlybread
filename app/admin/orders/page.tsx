// app/admin/orders/page.tsx
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-[var(--sage-light)] text-[var(--sage)]',
  preparing: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
};

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(orders));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Orders</h1>
        <p className="text-[var(--brown-600)] text-sm">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-[var(--brown-600)]">
          <div className="text-4xl mb-3">📭</div>
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="bg-[var(--warm-white)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--brown-950)] text-[var(--cream)]">
                  {['Order ID', 'Date', 'Items', 'Total', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {serialized.map((o: any) => (
                  <tr key={o._id} className="border-b border-[var(--border)] hover:bg-[var(--amber-pale)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">#{String(o._id).slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-[var(--brown-600)]">
                      {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {o.items.slice(0, 3).map((item: any) => (
                          <span key={item.productId} title={item.name}>{item.emoji}</span>
                        ))}
                        {o.items.length > 3 && <span className="text-xs text-[var(--brown-600)]">+{o.items.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-[var(--amber)]">	₦{o.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
