// app/api/seed/route.ts
// Run once to populate MongoDB with initial products
// POST /api/seed  (protect this in production!)
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

const SEED_PRODUCTS = [
  { name: "Artisan Sourdough", emoji: "🍞", description: "Hand-crafted sourdough with a crispy crust and tangy crumb. Baked fresh every morning using our 10-year-old starter.", price: 12.99, stock: 15, available: true, category: "Breads" },
  { name: "Wild Berry Tart", emoji: "🫐", description: "Buttery pastry shell filled with vanilla custard and seasonal wild berries. A celebration of natural flavors.", price: 18.99, stock: 8, available: true, category: "Pastries" },
  { name: "Truffle Honey Board", emoji: "🍯", description: "Premium Italian truffle-infused honey paired with aged cheeses and house-made crackers. Perfect for sharing.", price: 34.99, stock: 0, available: false, category: "Boards" },
  { name: "Dark Chocolate Mousse", emoji: "🍫", description: "Silky 72% dark chocolate mousse with sea salt flakes and a hint of espresso. Sinfully rich.", price: 9.99, stock: 20, available: true, category: "Desserts" },
  { name: "Heritage Grain Bowl", emoji: "🌾", description: "Ancient grains, roasted seasonal vegetables, house-made tahini dressing, and crispy chickpeas.", price: 16.99, stock: 12, available: true, category: "Mains" },
  { name: "Smoked Salmon Platter", emoji: "🐟", description: "Cold-smoked Atlantic salmon with capers, red onion, cream cheese, and house-baked blinis.", price: 28.99, stock: 5, available: true, category: "Boards" },
  { name: "Heirloom Tomato Bisque", emoji: "🍅", description: "Slow-roasted heirloom tomatoes, fresh basil, and a swirl of cultured cream.", price: 11.99, stock: 0, available: false, category: "Mains" },
  { name: "Lavender Crème Brûlée", emoji: "🍮", description: "Classic French custard infused with Provençal lavender, finished with a torched caramelized sugar crust.", price: 13.99, stock: 10, available: true, category: "Desserts" },
];

export async function POST() {
  try {
    await connectDB();
    await Product.deleteMany({});
    const products = await Product.insertMany(SEED_PRODUCTS);
    return NextResponse.json({ message: `Seeded ${products.length} products` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
