'use client';
// components/admin/AdminSidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6 sticky top-20">
      <div className="text-md font-bold uppercase tracking-wider text text-blue-700 mb-3 px-1">Admin Panel</div>
      <nav className="space-y-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-yellow-500 text-white'
                  : 'text-blue-800 hover:bg-yellow-200 hover:text-yellow-600'
              }`}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
