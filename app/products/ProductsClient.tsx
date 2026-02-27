'use client';
// app/products/ProductsClient.tsx
import { useState } from 'react';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Product, Category } from '@/types';
import { CATEGORIES } from '@/types';

export function ProductsClient({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category>('All');

  const filtered = category === 'All'
    ? products
    : products.filter((p) => p.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className=" text-4xl font-bold mb-1">Our Menu</h1>
      <p className="text-[var(--dark-blue)] mb-8">Freshly made, lovingly crafted</p>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === cat
                ? 'bg-[var(--pale-yellow)] border-[var(--pale-yellow)] text-gray-900'
                : 'bg-[var(--warm-white)] border-[var(--border)] text-[var(--brown-950)] hover:border-[var(--dark-blue)] hover:text-[var(--dark-blue)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--brown-600)]">
          <div className="text-5xl mb-4">🍽️</div>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
