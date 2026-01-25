const mongoose = require('mongoose');
const Store = require('../models/Store');
const StoreCategory = require('../models/StoreCategory');
const StoreProduct = require('../models/StoreProduct');
const StoreInventory = require('../models/StoreInventory');
const Product = require('../models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quilbox');
        console.log('Connected to MongoDB');

        // Clear existing store data
        await Store.deleteMany({});
        await StoreCategory.deleteMany({});
        await StoreProduct.deleteMany({});
        await StoreInventory.deleteMany({});

        const products = await Product.find({ isActive: true });
        if (products.length === 0) {
            console.log('No products found to seed stores. Please seed products first.');
            process.exit(1);
        }

        const stores = [
            {
                name: 'A-Z Stationary',
                description: 'MRUDUL PARK PART / 4, A/132, Maharana Pratap Rd, Chanakyapuri, Ahmedabad, Gujarat 380061',
                bannerImage: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=1000',
                location: { lat: 23.0775, lng: 72.5367 }
            },
            {
                name: 'Hetal Stationary',
                description: 'B/1, Mirambica School Road, Sundar Nagar, Naranpura, Ahmedabad, Gujarat 380013',
                bannerImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000',
                location: { lat: 23.0583, lng: 72.5568 }
            },
            {
                name: 'Ram Stationary',
                description: '15, Avni complex, naranpura, Ahmedabad, Gujarat 380013',
                bannerImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=1000',
                location: { lat: 23.0520, lng: 72.5543 }
            }
        ];

        const categories = ['Discounted', 'High Sales', 'Combo Offer', 'New Arrivals'];
        for (const storeData of stores) {
            const store = await Store.create(storeData);
            console.log(`Created store: ${store.name}`);

            // Populate Inventory for all products for this store
            for (const product of products) {
                await StoreInventory.create({
                    store: store._id,
                    product: product._id,
                    quantity: Math.floor(Math.random() * 50) + 10 // Random stock 10-60
                });
            }

            for (let i = 0; i < categories.length; i++) {
                const category = await StoreCategory.create({
                    store: store._id,
                    name: categories[i],
                    order: i
                });

                // Pick 20 products for display categories
                for (let j = 0; j < 20; j++) {
                    const productIdx = (i * 20 + j) % products.length;
                    const product = products[productIdx];

                    await StoreProduct.create({
                        store: store._id,
                        product: product._id,
                        category: category._id,
                        isFeatured: j < 5
                    });
                }
            }
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
