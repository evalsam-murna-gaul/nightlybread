// models/Order.ts
import { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  emoji:     { type: String, default: '🍽️' },
  quantity:  { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema(
  {
    userId:      { type: String, required: true, index: true }, // Supabase user UUID
    items:       { type: [OrderItemSchema], required: true },
    subtotal:    { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 4.99 },
    total:       { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'delivered'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model('Order', OrderSchema);
