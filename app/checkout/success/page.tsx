// app/checkout/success/page.tsx
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-5">🎉</div>
      <h1 className="font-serif text-3xl font-bold mb-2">Order Placed!</h1>
      <p className="text-[var(--brown-600)] mb-8 leading-relaxed">
        Thank you for your order. We&apos;re preparing it with love and care. You&apos;ll receive a confirmation shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders" className="bg-[var(--brown-800)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--brown-600)] transition-colors">
          View Orders
        </Link>
        <Link href="/products" className="bg-[var(--amber)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--amber-light)] transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
