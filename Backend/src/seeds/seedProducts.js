const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category'); // Might need to check if this exists
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const CATEGORIES = ["Writing", "Notebooks", "Art", "Office", "School", "Combo", "Papers", "Gift Sets"];
const BRANDS = ["Faber-Castell", "Camlin", "Classmate", "Parker", "Doms", "Pilot", "Uniball", "Luxor"];

const stationaryImages = [
    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd",
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57",
    "https://images.unsplash.com/photo-1544816153-12ad5d714304",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    "https://images.unsplash.com/photo-1580562867835-0a6958393bb6",
    "https://images.unsplash.com/photo-1502472944661-345386f6a73c",
    "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b"
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quilbox');
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        let productsToCreate = [];

        CATEGORIES.forEach(category => {
            for (let i = 1; i <= 15; i++) {
                const originalPrice = Math.floor(Math.random() * 500) + 50;
                const discount = Math.floor(Math.random() * 30);
                const price = Math.floor(originalPrice * (1 - discount / 100));
                const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
                const imageUrl = stationaryImages[Math.floor(Math.random() * stationaryImages.length)] + "?w=500&auto=format&fit=crop&q=60";

                productsToCreate.push({
                    name: `${brand} ${category} Item ${i} - Premium`,
                    description: `High quality ${brand} ${category.toLowerCase()} perfect for school, office, or professional art work.`,
                    price: price,
                    stock: Math.floor(Math.random() * 100) + 10,
                    imageUrl: imageUrl,
                    isActive: true,
                    category: category, // We'll store it as a string for now as per controller logic
                    brand: brand,
                    popularity: Math.floor(Math.random() * 100),
                    discount: discount
                });
            }
        });

        await Product.insertMany(productsToCreate);
        console.log(`Seeded ${productsToCreate.length} products successfully`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedProducts();
