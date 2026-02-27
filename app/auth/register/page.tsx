'use client';
// app/auth/register/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (err) { setError(err.message); setLoading(false); return; }

    // Insert role into user_roles table (role defaults to 'user')
    if (data.user) {
      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: 'user',
        name,
      });
    }

    setLoading(false);
    toast.success('Account created! Please check your email to confirm.');
    window.location.href = '/auth/confirm';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[var(--cream)]">
      <div className="w-full max-w-md">
        <div className="bg-[var(--warm-white)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3"><Image src='/logo.png' width={100} height={100} alt='' className='mx-auto'/></div>
            <h1 className="font-serif text-2xl font-bold">Create Account</h1>
            <p className="text-[var(--brown-600)] text-sm mt-1">Become a member of the Nightly Bread family today!🎉</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-5">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--brown-800)] mb-1.5">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-[var(--amber)] transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--brown-800)] mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-[var(--amber)] transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--brown-800)] mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-[var(--amber)] transition pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brown-600)]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--brown-800)] mb-1.5">Confirm Password</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-[var(--amber)] transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[var(--amber)] hover:bg-[var(--amber-light)] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm text-[var(--brown-600)] mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[var(--amber)] font-semibold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}