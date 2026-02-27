'use client';
// app/orders/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-[var(--sage-light)] text-[var(--sage)]',
  preparing: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoading(false); return; }

      const res = await fetch('/api/orders', {
        headers: { 'x-user-id': session.user.id },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center text-[var(--brown-600)]">
      Loading orders...
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold mb-1">Order History</h1>
      <p className="text-[var(--brown-600)] mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-serif text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-[var(--brown-600)] mb-6">Your completed orders will appear here.</p>
          <Link href="/products" className="bg-[var(--amber)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--amber-light)] transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={String(order._id)} className="bg-[var(--warm-white)] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm">Order #{String(order._id).slice(-8).toUpperCase()}</div>
                  <div className="text-xs text-[var(--brown-600)] mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-[var(--amber)]">${(order.total ?? 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-1">
                {order.items.map((item: any) => (
                  <div key={item.productId} className="flex items-center gap-2 text-sm text-[var(--brown-600)]">
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                    <span className="opacity-60">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}