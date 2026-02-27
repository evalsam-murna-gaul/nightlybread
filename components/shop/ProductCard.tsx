'use client';
// components/shop/ProductCard.tsx
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { addItem, loading } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.available) return;
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
    });
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative bg-[var(--warm-white)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col"
    >
      {/* Out of stock badge */}
      {!product.available && (
        <div className="absolute top-3 right-3 z-10 bg-[var(--brown-950)] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          Out of Stock
        </div>
      )}

      {/* Image / Emoji */}
      <div className="w-full h-48 bg-[var(--amber-pale)] flex items-center justify-center text-7xl">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          product.emoji
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sage)] mb-1">
          {product.category}
        </div>
        <h3 className="font-serif font-bold text-lg leading-tight mb-1 group-hover:text-[var(--amber)] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--brown-600)] line-clamp-2 flex-1 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-[var(--amber)]">
            	₦{(product.price ?? 0).toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.available || loading}
            className="flex items-center gap-1.5 bg-[var(--brown-800)] hover:bg-[var(--amber)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <ShoppingBag size={14} />
            {product.available ? 'Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </Link>
  );
}