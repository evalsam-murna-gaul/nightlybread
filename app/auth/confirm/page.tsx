// app/auth/confirm/page.tsx
import Link from 'next/link';

export default function ConfirmPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">📬</div>
      <h1 className="font-serif text-2xl font-bold mb-2">Check Your Email</h1>
      <p className="text-[var(--brown-600)] mb-6 leading-relaxed">
        We sent a confirmation link to your email. Please click it to activate your account, then log in.
      </p>
      <Link href="/auth/login" className="bg-[var(--amber)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--amber-light)] transition-colors inline-block">
        Go to Login
      </Link>
    </div>
  );
}
