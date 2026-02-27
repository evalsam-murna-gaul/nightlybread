'use client';
// app/admin/products/AdminProductsClient.tsx
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { CATEGORIES } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  name: string; description: string; price: string; stock: string;
  category: string; emoji: string; imageUrl: string;
}

const EMPTY_FORM: FormData = { name: '', description: '', price: '', stock: '', category: 'Mains', emoji: '🍽️', imageUrl: '' };

function safeForm(f?: Partial<FormData>): FormData {
  return {
    name:        f?.name        ?? '',
    description: f?.description ?? '',
    price:       f?.price       ?? '',
    stock:       f?.stock       ?? '',
    category:    f?.category    ?? 'Mains',
    emoji:       f?.emoji       ?? '🍽️',
    imageUrl:    f?.imageUrl    ?? '',
  };
}

export function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(safeForm());
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
  }, []);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(userId ? { 'x-user-id': userId } : {}),
  });

  const openCreate = () => { setForm(safeForm()); setEditId(null); setModal('create'); };
  const openEdit = (p: Product) => {
    setForm(safeForm({ name: p.name, description: p.description, price: String(p.price ?? ''), stock: String(p.stock ?? ''), category: p.category, emoji: p.emoji, imageUrl: p.imageUrl ?? '' }));
    setEditId(String(p._id)); setModal('edit');
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    if (modal === 'edit' && !editId) { toast.error('No product selected'); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        const res = await fetch('/api/products', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
        const p = await res.json();
        setProducts(prev => [{ ...p, _id: String(p._id) }, ...prev]);
        toast.success('Product created!');
      } else {
        const res = await fetch(`/api/products/${editId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(form) });
        const p = await res.json();
        setProducts(prev => prev.map(x => String(x._id) === editId ? { ...p, _id: String(p._id) } : x));
        toast.success('Product updated!');
      }
      setModal(null);
    } catch { toast.error('Something went wrong'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders() });
    setProducts(prev => prev.filter(p => String(p._id) !== id));
    toast.success('Product deleted');
  };

  const handleToggle = async (p: Product) => {
    const id = String(p._id);
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ available: !p.available }),
    });
    const updated = await res.json();
    setProducts(prev => prev.map(x => String(x._id) === id ? { ...updated, _id: id } : x));
    toast.success(`Marked as ${updated.available ? 'In Stock' : 'Out of Stock'}`);
  };

  const f = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const inputCls = "w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--amber)]";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold">Products</h1>
          <p className="text-[var(--brown-600)] text-sm">{products.length} products</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--amber)] hover:bg-[var(--amber-light)] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-[var(--warm-white)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--brown-950)] text-[var(--cream)]">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={String(p._id)} className="border-b border-[var(--border)] hover:bg-[var(--amber-pale)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.emoji}</span>
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--brown-600)]">{p.category}</td>
                  <td className="px-4 py-3 font-bold text-[var(--amber)]">${(p.price ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{p.stock ?? 0}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(p)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${p.available ? 'bg-[var(--sage-light)] text-[var(--sage)] hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-[var(--sage-light)] hover:text-[var(--sage)]'}`}>
                      {p.available ? <><ToggleRight size={13} /> In Stock</> : <><ToggleLeft size={13} /> Out of Stock</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-[var(--amber-pale)] text-[var(--brown-800)] transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--warm-white)] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-serif text-xl font-bold">{modal === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} className="text-[var(--brown-600)] hover:text-[var(--brown-950)] text-xl leading-none">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--brown-800)]">Name *</label>
                  <input type="text" value={form.name} onChange={f('name')} placeholder="Product name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--brown-800)]">Emoji</label>
                  <input type="text" value={form.emoji} onChange={f('emoji')} placeholder="🍽️" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--brown-800)]">Description</label>
                <textarea rows={3} value={form.description} onChange={f('description')} placeholder="Describe the product..." className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--brown-800)]">Price ($) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={f('price')} placeholder="0.00" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--brown-800)]">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={f('stock')} placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--brown-800)]">Category</label>
                  <select value={form.category} onChange={f('category')} className={inputCls}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--brown-800)]">Image URL (optional)</label>
                <input type="url" value={form.imageUrl} onChange={f('imageUrl')} placeholder="https://..." className={inputCls} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--amber-pale)] transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-[var(--amber)] hover:bg-[var(--amber-light)] disabled:opacity-60 text-white rounded-lg transition-colors">
                {saving ? 'Saving...' : modal === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}