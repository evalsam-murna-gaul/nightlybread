'use client';
// components/ui/Navbar.tsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, LayoutDashboard, ClipboardList, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/components/shop/CartProvider';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';


export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { itemCount } = useCart();
  const [user, setUser] = useState<{ email?: string; role?: string; name?: string } | null>(null);

  useEffect(() => {
    // Use getSession() - reads from cookie, no network call, no lock
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setUser(null); return; }
      const { data: roleData } = await supabase.from('user_roles').select('role, name').eq('user_id', session.user.id).single();
      setUser({ email: session.user.email, role: roleData?.role ?? 'user', name: roleData?.name ?? session.user.email });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session?.user) { setUser(null); return; }
      const { data: roleData } = await supabase.from('user_roles').select('role, name').eq('user_id', session.user.id).single();
      setUser({ email: session.user.email, role: roleData?.role ?? 'user', name: roleData?.name ?? session.user.email });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
    router.refresh();
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-[#ebea9c] opacity-80 hover:opacity-100 hover:bg-white/10 ${pathname === href ? 'bg-white/15 opacity-100' : ''}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-[#0D3163] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 font-serif text-md font-black text-amber-400 tracking-tight">
            <Image src='/logo.png' width={50} height={50} alt='' />
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {navLink('/products', 'Shop')}
            {user?.role === 'admin' && (
              <Link href="/admin" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#ebea9c] opacity-80 hover:opacity-100 hover:bg-white/10 transition-colors ${pathname.startsWith('/admin') ? 'bg-white/15 opacity-100' : ''}`}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            )}
            {user?.role === 'user' && (
              <Link href="/orders" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#ebea9c] opacity-80 hover:opacity-100 hover:bg-white/10 transition-colors ${pathname === '/orders' ? 'bg-white/15 opacity-100' : ''}`}>
                <ClipboardList size={15} /> Orders
              </Link>
            )}

            {user ? (
              <>
                <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#ebea9c] opacity-70">
                  <User size={14} /> {user.name}
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#ebea9c] opacity-80 hover:opacity-100 hover:bg-white/10 transition-colors">
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="px-3 py-1.5 rounded-md text-sm font-medium text-[#ebea9c] opacity-80 hover:opacity-100 hover:bg-white/10 transition-colors">
                Login
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center gap-2 bg-[#ebea9c] hover:bg-yellow-300 text-grey-100 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ml-1">
              <ShoppingCart size={16} />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[var(--amber)] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}