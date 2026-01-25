const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const products = [
    {
        name: "Classic Ballpoint Pen - Blue",
        description: "Smooth writing blue ink ballpoint pen.",
        price: 25,
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1518126273410-85f02888924b?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "A5 Hardcover Notebook",
        description: "Premium ivory paper, 160 pages, ruled.",
        price: 199,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Acrylic Paint Set - 12 Colors",
        description: "High-quality acrylic paints for professional artists.",
        price: 499,
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Mechanical Pencil 0.5mm",
        description: "Ergonomic grip mechanical pencil with 0.5mm lead.",
        price: 45,
        stock: 200,
        imageUrl: "https://images.unsplash.com/photo-1502472944661-345386f6a73c?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Office Organizer Tray",
        description: "Mesh metal desk organizer with multiple compartments.",
        price: 350,
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Executive Parker Vector Pen",
        description: "Elegant stainless steel body with gold clip.",
        price: 850,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Leather Bound Journal",
        description: "Authentic leather journal with handmade paper.",
        price: 1200,
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1544816153-12ad5d714304?w=500&auto=format&fit=crop&q=60",
        isActive: true
    },
    {
        name: "Dual Tip Calligraphy Markers",
        description: "Set of 24 vibrant colors with brush and fine tips.",
        price: 650,
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1580562867835-0a6958393bb6?w=500&auto=format&fit=crop&q=60",
        isActive: true
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log(`Database seeded with ${products.length} real products!`);
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
