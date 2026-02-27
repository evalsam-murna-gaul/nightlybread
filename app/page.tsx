// app/page.tsx
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Product as IProduct } from '@/types';

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({ available: true }).limit(4).lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-center py-24 px-4"
        style={{ background: 'linear-gradient(135deg, var(--blue-950) 0%, var(--blue-800) 60%, var(--blue-600) 100%)' }}
      >
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4700a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block bg-[#ebea9c] text-[#0a0325] text-xs font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6">
            ✦ Did Someone Say Nightly?!
          </div>
          <h1 className=" text-5xl md:text-7xl font-black text-[var(--cream)] leading-[1.08] mb-5">
            From Big Bites to <em className="text-amber-400 not-italic">Bigger Flavour</em>,<br />
            Served With Love
          </h1>
          <p className="text-[var(--cream)] opacity-70 text-lg max-w-md mx-auto leading-relaxed mb-8">
            Freshly toasted sandwiches made to satisfy every craving — from first bite to last.
          </p>

          <div className="flex flex-col items-center inline-block bg-[#ebea9c] text-[#0a0325] text-xs font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6">
            It's Nightly Bread or Nothing
          </div> <br />
          
          <Link
            href="/products"
            className="inline-block bg-[#ebea9c] hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3.5 mt-8 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg text-base"
          >
            Explore Menu →
          </Link>

        </div> 
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className=" text-3xl font-bold">Featured Items</h2>
            <p className="text-[var(--brown-600)] mt-1">Handpicked by popular demand</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[var(--amber)] hover:underline">
            View All →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--brown-600)]">
            <p className="text-5xl mb-4">🍽️</p>
            <p>No products yet. <Link href="/api/seed" className="text-[var(--amber)] font-semibold">Seed the database</Link></p>
          </div>
        )}
      </section>

      {/* Value props */}
      <section className="bg-[var(--warm-white)] border-y border-[var(--border)] py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🌿', title: 'Farm to Table', desc: 'Locally sourced ingredients' },
            { icon: '👨‍🍳', title: 'Signature Creations',  desc: 'Carefully crafted sandwich combinations you will not forget'},
            { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day delivery and pick up' },
          ].map((v) => (
            <div key={v.title}>
              <div className="text-4xl mb-3">{v.icon}</div>
              <div className="font-serif font-bold text-lg mb-1">{v.title}</div>
              <div className="text-sm text-[var(--brown-600)]">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
