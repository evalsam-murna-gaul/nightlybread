'use client';
// app/cart/page.tsx
import { useCart } from '@/components/shop/CartProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { DELIVERY_FEE } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function CartPage() {
  const { items, subtotal, total, updateQty, removeItem, clearCart, loading } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const sessionId = localStorage.getItem('session_id') ?? '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-session-id': sessionId,
    };
    if (session?.user?.id) headers['x-user-id'] = session.user.id;

    const res = await fetch('/api/orders', { method: 'POST', headers });

    if (!res.ok) {
      toast.error('Failed to place order');
      return;
    }

    await clearCart();
    router.push('/checkout/success');
  };

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="font-serif text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-[var(--brown-600)] mb-6">Looks like you haven&apos;t added anything yet.</p>
      <Link href="/products" className="inline-block bg-[var(--amber)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--amber-light)] transition-colors">
        Browse Menu
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold mb-1">Your Cart</h1>
      <p className="text-[var(--brown-600)] mb-8">{items.length} item{items.length !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 bg-[var(--warm-white)] border border-[var(--border)] rounded-xl p-4">
              <div className="w-14 h-14 rounded-lg bg-[var(--amber-pale)] flex items-center justify-center text-3xl flex-shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold truncate">{item.name}</div>
                <div className="text-sm text-[var(--amber)] font-semibold">${item.price.toFixed(2)} each</div>
              </div>
              {/* Qty controls */}
              <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--cream)]">
                <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--amber-pale)] transition-colors">
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--amber-pale)] transition-colors">
                  <Plus size={13} />
                </button>
              </div>
              <div className="font-bold text-[var(--amber)] min-w-[60px] text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-[var(--warm-white)] border border-[var(--border)] rounded-xl p-5 sticky top-20">
          <h2 className="font-serif text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-[var(--brown-600)] mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>${DELIVERY_FEE.toFixed(2)}</span></div>
          </div>
          <div className="flex justify-between font-bold text-base pt-3 border-t border-[var(--border)]">
            <span>Total</span>
            <span className="text-[var(--amber)]">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-5 flex items-center justify-center gap-2 bg-[var(--amber)] hover:bg-[var(--amber-light)] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            <ShoppingBag size={18} />
            Proceed to Checkout
          </button>
          <Link href="/products" className="block text-center text-sm text-[var(--brown-600)] hover:text-[var(--amber)] mt-3 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}