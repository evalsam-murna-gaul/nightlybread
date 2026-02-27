'use client';
// app/admin/layout.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/auth/login?redirect=/admin');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleData?.role !== 'admin') {
        router.replace('/');
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }
    checkAccess();
  }, [router]);

  if (checking) return (
    <div className="flex items-center justify-center min-h-[60vh] text-[var(--brown-600)]">
      <div className="text-center">
        <div className="text-3xl mb-3">🔐</div>
        <p>Verifying access...</p>
      </div>
    </div>
  );

  if (!authorized) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}