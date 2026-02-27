'use client';
// app/products/[id]/ProductDetailClient.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '@/components/shop/CartProvider';
import type { Product } from '@/types';

export function ProductDetailClient({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem, loading } = useCart();

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
    }, qty);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-[var(--brown-600)] hover:text-[var(--amber)] mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-[var(--amber-pale)] h-80 md:h-96 flex items-center justify-center text-9xl shadow-inner">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : product.emoji}
        </div>

        {/* Info */}
        <div>
          <div className="inline-block bg-[var(--sage-light)] text-[var(--sage)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {product.category}
          </div>
          <h1 className=" text-4xl font-black leading-tight mb-3">{product.name}</h1>
          <div className="text-3xl font-bold text-[var(--amber)] mb-4">${product.price.toFixed(2)}</div>
          <p className="text-[var(--brown-600)] leading-relaxed mb-5">{product.description}</p>

          {/* Stock status */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6 ${
            product.available
              ? 'bg-[var(--sage-light)] text-[var(--sage)]'
              : 'bg-red-50 text-red-600'
          }`}>
            {product.available
              ? <><CheckCircle size={14} /> In Stock ({product.stock} available)</>
              : <><XCircle size={14} /> Out of Stock</>
            }
          </div>

          {/* Quantity + Add */}
          {product.available && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--cream)]">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[var(--amber-pale)] transition-colors text-[var(--brown-800)]">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[var(--amber-pale)] transition-colors text-[var(--brown-800)]">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--amber)] hover:bg-[var(--amber-light)] disabled:opacity-60 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
              >
                <ShoppingBag size={18} />
                Add to Cart · ₦{(product.price * qty).toFixed(2)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
