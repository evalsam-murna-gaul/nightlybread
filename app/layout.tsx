// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Toaster } from 'sonner';
import { CartProvider } from '@/components/shop/CartProvider';

export const metadata: Metadata = {
  title: 'Taste & Co. | Artisan Food Store',
  description: 'Handcrafted foods, seasonal ingredients, and curated gourmet boards.',
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
              style={{ background: 'var(--brown-950)', color: 'var(--cream)' }}
              className="py-8 text-center text-sm opacity-70 mt-auto"
            >
              © {new Date().getFullYear()} Taste & Co. · All rights reserved
            </footer>
          </div>
        </CartProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: 'var(--brown-950)', color: 'var(--cream)', border: 'none' },
          }}
        />
      </body>
    </html>
  );
}