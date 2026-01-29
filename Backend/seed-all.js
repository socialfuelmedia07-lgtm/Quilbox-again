const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Store = require('./src/models/Store');
const StoreInventory = require('./src/models/StoreInventory');
const StoreCategory = require('./src/models/StoreCategory');
const StoreProduct = require('./src/models/StoreProduct');
require('dotenv').config();

const IMAGES = {
    Writing: [
        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd",
        "https://images.unsplash.com/photo-1585336261022-69c66d1ef72c",
        "https://images.unsplash.com/photo-1610444583731-971759512143",
        "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d",
        "https://images.unsplash.com/photo-1542435503-956c469947f6"
    ],
    Notebooks: [
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57",
        "https://images.unsplash.com/photo-1544816153-12ad5d714304",
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        "https://images.unsplash.com/photo-1512314889357-e157c22f938d",
        "https://images.unsplash.com/photo-1518126273410-85f02888924b"
    ],
    "Art Supplies": [
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
        "https://images.unsplash.com/photo-1580562867835-0a6958393bb6",
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
        "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b",
        "https://images.unsplash.com/photo-1460662953250-9602e3f88647"
    ],
    "Office Desk": [
        "https://images.unsplash.com/photo-1562654501-a0ccc0af3fb1",
        "https://images.unsplash.com/photo-1616628188506-4ad8de66ad71",
        "https://images.unsplash.com/photo-1586075010633-247017088b90",
        "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3",
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575"
    ],
    Combo: [
        "https://images.unsplash.com/photo-1502472944661-345386f6a73c",
        "https://images.unsplash.com/photo-1498188194411-cf7214f42017",
        "https://images.unsplash.com/photo-1516962080544-eac695c93791",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401",
        "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3"
    ]
};

const generateProducts = (category, count) => {
    const items = [];
    const baseNames = {
        Writing: ["Gel Pen", "Luxury Fountain Pen", "Mechanical Pencil", "Permanent Marker", "Pastel Highlighter", "Technical Drawing Pen", "Ballpoint Pen", "Fine Liner", "Brush Pen", "Whiteboard Marker"],
        Notebooks: ["Spiral Diary", "Leather Journal", "Pocket Notepad", "A4 Sketchbook", "Dot Grid Notebook", "Hardcover Organizer", "Softbound Planner", "Subject Notebook", "Travel Journal", "Recycled Paper Pad"],
        "Art Supplies": ["Acrylic Tube", "Water Color Set", "Camel Hair Brush", "Canvas Board", "Pallette Knife", "Oil Pastel Box", "Charcoal Sticks", "Erasable Crayons", "Sketching Pencils", "Varnish Gloss"],
        "Office Desk": ["Desk Organizer", "Metal Stapler", "Tape Dispenser", "Paper Clip Jar", "Document Tray", "Sticky Notes Set", "Desktop Calendar", "Pen Stand", "Card Holder", "Calculator"],
        Combo: ["Student Pack", "Artist Bundle", "Office Essentials Kit", "Exam Season Box", "Drawing Master Kit", "Planner Set", "Eco-friendly Stationery", "Luxury Gift Hamper", "Back to School Combo", "Coloring Kit"]
    };

    const brands = ["QuilBox Elite", "Faber-Castle", "Parker", "Steadtler", "Reynolds", "Cello", "Classmate", "Natraj", "Camlin", "Doms"];

    for (let i = 1; i <= count; i++) {
        const baseName = baseNames[category][i % baseNames[category].length];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const image = IMAGES[category][Math.floor(Math.random() * IMAGES[category].length)] + "?w=500&auto=format&fit=crop&q=60";

        items.push({
            name: `${brand} ${baseName} ${i > 10 ? '(Series ' + i + ')' : ''}`,
            category: category,
            price: Math.floor(Math.random() * 1000) + 50,
            stock: Math.floor(Math.random() * 200) + 20,
            imageUrl: image,
            brand: brand,
            popularity: Math.floor(Math.random() * 100),
            discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0,
            isActive: true,
            description: `High-quality ${baseName} by ${brand}. Perfect for professional and creative use.`
        });
    }
    return items;
};

const stores = [
    {
        name: "A-Z Stationary",
        description: "Your go-to store for all stationary needs in Navrangpura.",
        bannerImage: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        location: { lat: 23.0387, lng: 72.5626 }
    },
    {
        name: "Hetal Stationary",
        description: "Quality art supplies and books in Naranpura.",
        bannerImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        location: { lat: 23.0530, lng: 72.5530 }
    },
    {
        name: "Ram Stationary",
        description: "Best deals on office supplies in Ghatlodia.",
        bannerImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        location: { lat: 23.0700, lng: 72.5300 }
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        await Product.deleteMany({});
        await Store.deleteMany({});
        await StoreInventory.deleteMany({});
        await StoreCategory.deleteMany({});
        await StoreProduct.deleteMany({});
        console.log("Cleared existing data.");

        let allProducts = [];
        ["Writing", "Notebooks", "Art Supplies", "Office Desk", "Combo"].forEach(cat => {
            allProducts = allProducts.concat(generateProducts(cat, 25)); // 25 per category = 125 total
        });

        const createdProducts = await Product.insertMany(allProducts);
        console.log(`Seeded ${createdProducts.length} products.`);

        const createdStores = await Store.insertMany(stores);
        console.log(`Seeded ${createdStores.length} stores.`);

        for (const store of createdStores) {
            const categoryNames = ["Best Seller", "Discounted", "Combo Offer", "Writing", "Notebooks", "Art Supplies", "Office Desk"];
            const createdCategories = [];

            for (let i = 0; i < categoryNames.length; i++) {
                const cat = await StoreCategory.create({
                    store: store._id,
                    name: categoryNames[i],
                    order: i
                });
                createdCategories.push(cat);
            }

            const storeProducts = [];
            const inventoryItems = [];

            createdProducts.forEach((product) => {
                let primaryCatName = product.category;
                if (primaryCatName === 'Combo') primaryCatName = 'Combo Offer';

                const targetCat = createdCategories.find(c => c.name === primaryCatName);

                if (targetCat) {
                    storeProducts.push({
                        store: store._id,
                        product: product._id,
                        category: targetCat._id,
                        isFeatured: product.popularity > 85
                    });

                    // Add to Best Seller if popularity is high
                    if (product.popularity > 90) {
                        const bestSellerCat = createdCategories.find(c => c.name === "Best Seller");
                        storeProducts.push({
                            store: store._id,
                            product: product._id,
                            category: bestSellerCat._id,
                            isFeatured: true
                        });
                    }

                    // Add to Discounted if discount exists
                    if (product.discount > 0) {
                        const discountedCat = createdCategories.find(c => c.name === "Discounted");
                        storeProducts.push({
                            store: store._id,
                            product: product._id,
                            category: discountedCat._id,
                            isFeatured: product.discount > 20
                        });
                    }

                    inventoryItems.push({
                        store: store._id,
                        product: product._id,
                        quantity: Math.floor(Math.random() * 100) + 10
                    });
                }
            });

            await StoreProduct.insertMany(storeProducts);
            await StoreInventory.insertMany(inventoryItems);
            console.log(`Linked products for ${store.name}`);
        }

        console.log("Database seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
