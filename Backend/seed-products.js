const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const products = [
    // Writing
    {
        name: "Classic Ballpoint Pen - Blue",
        category: "Writing",
        price: 25,
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1518126273410-85f02888924b?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Executive Parker Vector Pen",
        category: "Writing",
        price: 850,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    // Notebooks
    {
        name: "A5 Hardcover Notebook",
        category: "Notebooks",
        price: 199,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Premium Leather Journal",
        category: "Notebooks",
        price: 1200,
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1544816153-12ad5d714304?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    // Art
    {
        name: "Acrylic Paint Set - 12 Colors",
        category: "Art",
        price: 499,
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Dual Tip Calligraphy Markers",
        category: "Art",
        price: 650,
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1580562867835-0a6958393bb6?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    // Combo
    {
        name: "Student Starter Kit",
        category: "Combo",
        price: 450,
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1502472944661-345386f6a73c?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Professional Artist Bundle",
        category: "Combo",
        price: 2500,
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500&auto=format&fit=crop&q=60",
        isActive: true
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log(`Database seeded with ${products.length} categorized products!`);
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
