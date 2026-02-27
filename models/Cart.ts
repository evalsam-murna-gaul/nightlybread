// models/Cart.ts
import mongoose, { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  emoji:     { type: String, default: '🍽️' },
  quantity:  { type: Number, required: true, min: 1 },
}, { _id: false });

const CartSchema = new Schema(
  {
    userId:    { type: String, index: true },      // Supabase user UUID (authenticated)
    sessionId: { type: String, index: true },      // Anonymous session ID (guests)
    items:     { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

// Each user/session has exactly one cart
CartSchema.index({ userId: 1 }, { unique: true, sparse: true });
CartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

export const Cart = models.Cart || model('Cart', CartSchema);
