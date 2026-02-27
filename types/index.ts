// types/index.ts

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  category: string;
  imageUrl?: string;
  emoji: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId?: string;     // null for guests
  sessionId?: string;  // for guests
  items: CartItem[];
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

export type Category = 'All' | 'Breads' | 'Pastries' | 'Boards' | 'Desserts' | 'Mains' | 'Drinks' | 'Sides' | 'Platters';

export const CATEGORIES: Category[] = ['All', 'Breads', 'Pastries', 'Boards', 'Desserts', 'Mains', 'Drinks', 'Sides', 'Platters'];

export const DELIVERY_FEE = 4.99;