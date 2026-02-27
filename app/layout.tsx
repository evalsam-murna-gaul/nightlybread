// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Toaster } from 'sonner';
import { CartProvider } from '@/components/shop/CartProvider';

export const metadata: Metadata = {
  title: 'Nightly Bread',
  description: 'Your sure plug to the best sandwiches.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer
              style={{ background: 'var(--pale-yellow)', color: 'var(--dark-blue)' }}
              className="py-8 text-center text-sm opacity-70 mt-auto"
            >
              © {new Date().getFullYear()} Nightly Bread · All rights reserved
            </footer>
          </div>
        </CartProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: 'var(--pale-yellow)', color: 'var(--dark-blue)', border: 'none' },
          }}
        />
      </body>
    </html>
  );
}