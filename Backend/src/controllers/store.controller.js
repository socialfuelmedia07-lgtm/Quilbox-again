const Store = require('../models/Store');
const StoreCategory = require('../models/StoreCategory');
const StoreProduct = require('../models/StoreProduct');
const Product = require('../models/Product');

exports.getStores = async (req, res) => {
    try {
        const stores = await Store.find({ isActive: true });
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.storeId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStoreCategories = async (req, res) => {
    try {
        const categories = await StoreCategory.find({ store: req.params.storeId }).sort({ order: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStoreProducts = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { search } = req.query;

        // Base query for store products
        let query = { store: storeId };

        if (search) {
            // Find products matching search string
            const matchedProducts = await Product.find({
                name: { $regex: search, $options: 'i' }
            });
            const productIds = matchedProducts.map(p => p._id);
            query.product = { $in: productIds };
        }

        const storeProducts = await StoreProduct.find(query)
            .populate('product')
            .populate('category');

        const transformProduct = (p) => {
            if (!p) return null;

            const stationaryFallbacks = [
                "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd",
                "https://images.unsplash.com/photo-1531346878377-a5be20888e57",
                "https://images.unsplash.com/photo-1544816153-12ad5d714304",
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
                "https://images.unsplash.com/photo-1580562867835-0a6958393bb6",
                "https://images.unsplash.com/photo-1502472944661-345386f6a73c",
                "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b"
            ];

            const fallbackImg = stationaryFallbacks[Math.floor(Math.random() * stationaryFallbacks.length)] + "?w=500&auto=format&fit=crop&q=60";

            const price = Number(p.price) || 0;
            const hasDiscount = Math.random() > 0.5; // Simulate discount for variety if not in DB
            const originalPrice = hasDiscount ? Math.floor(price * 1.3) : price;

            return {
                id: p._id,
                name: p.name,
                image: p.imageUrl || fallbackImg,
                originalPrice: originalPrice,
                discountedPrice: price,
                packSize: p.description && p.description.length > 5 ? p.description.substring(0, 15) : 'Single',
                category: p.category?.name || 'Stationary'
            };
        };

        const featured = storeProducts
            .filter(sp => sp.isFeatured)
            .map(sp => transformProduct(sp.product));

        const categoriesMap = {};
        storeProducts.forEach(sp => {
            const catName = sp.category.name;
            if (!categoriesMap[catName]) {
                categoriesMap[catName] = [];
            }
            categoriesMap[catName].push(transformProduct(sp.product));
        });

        const categories = Object.keys(categoriesMap).map(name => ({
            categoryName: name,
            products: categoriesMap[name]
        }));

        res.status(200).json({
            featured,
            categories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
