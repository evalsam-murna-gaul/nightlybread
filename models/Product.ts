// models/Product.ts
import mongoose, { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  category: string;
  imageUrl?: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    stock:       { type: Number, required: true, min: 0, default: 0 },
    available:   { type: Boolean, default: true },
    category:    { type: String, required: true, enum: ['Breads', 'Pastries', 'Boards', 'Desserts', 'Mains', 'Drinks', 'Sides', 'Platters'] },
    imageUrl:    { type: String },
    emoji:       { type: String, default: '🍽️' },
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>('Product', ProductSchema);