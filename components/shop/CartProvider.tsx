'use client';
// components/shop/CartProvider.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { DELIVERY_FEE } from '@/types';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  loading: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

function getOrCreateSessionId(): string {
  let id = localStorage.getItem('session_id');
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('session_id', id); }
  return id;
}

function getHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  return { 'Content-Type': 'application/json', 'x-session-id': getOrCreateSessionId() };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { headers: getHeaders() });
      const data = await res.json();
      setItems(data.items ?? []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addItem = useCallback(async (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ...item, quantity: qty }),
      });
      const data = await res.json();
      setItems(data.items ?? []);
      toast.success(`${item.name} added to cart`);
    } catch { toast.error('Failed to add item'); }
    finally { setLoading(false); }
  }, []);

  const updateQty = useCallback(async (productId: string, qty: number) => {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity: qty }),
    });
    const data = await res.json();
    setItems(data.items ?? []);
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const res = await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE', headers: getHeaders() });
    const data = await res.json();
    setItems(data.items ?? []);
  }, []);

  const clearCart = useCallback(async () => {
    const res = await fetch('/api/cart', { method: 'DELETE', headers: getHeaders() });
    const data = await res.json();
    setItems(data.items ?? []);
  }, []);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, total, loading, addItem, updateQty, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}