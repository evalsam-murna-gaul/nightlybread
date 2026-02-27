'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      toast.success('Welcome back!');
      window.location.href = redirect;
    } else {
      setError('Sign in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--warm-white)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">
          <Image src='/logo.png' width={100} height={100} alt='' className='mx-auto' />
        </div>
        <h1 className="font-serif text-2xl font-bold">Welcome Back</h1>
        <p className="text-[var(--brown-600)] text-sm mt-1">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-5">{error}</div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--brown-800)] mb-1.5">Email</label>
          <input
            type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-[var(--amber)] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--brown-800)] mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-[var(--amber)] transition pr-10"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brown-600)]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-[var(--amber)] hover:bg-[var(--amber-light)] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-sm text-[var(--brown-600)] mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-[var(--amber)] font-semibold hover:underline">Register</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[var(--cream)]">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}