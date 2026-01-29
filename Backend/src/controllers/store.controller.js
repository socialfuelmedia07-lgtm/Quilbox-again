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
        const { search, category, brands, sort } = req.query;

        // Base query for store products
        let query = { store: storeId };

        // 1. Filter by Category Name if provided
        if (category) {
            const storeCat = await StoreCategory.findOne({ store: storeId, name: category });
            if (storeCat) {
                query.category = storeCat._id;
            } else if (category === "Best Seller") {
                query.isFeatured = true;
            }
        }

        // 2. Filter by Product fields (Search & Brands)
        let productQuery = { isActive: true };
        if (search) {
            productQuery.name = { $regex: search, $options: 'i' };
        }
        if (brands) {
            // Support single brand string or array
            const brandList = Array.isArray(brands) ? brands : brands.split(',');
            productQuery.brand = { $in: brandList };
        }

        // Find products matching product-level criteria
        const matchedProducts = await Product.find(productQuery);
        const productIds = matchedProducts.map(p => p._id);
        query.product = { $in: productIds };

        // 3. Fetch Store Products with Category and Product info
        let storeProducts = await StoreProduct.find(query)
            .populate('product')
            .populate('category');

        const transformProduct = (sp) => {
            if (!sp || !sp.product) return null;
            const p = sp.product;

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

            // Price Logic: Preference to StoreProduct specific price/discount if added later
            const originalPrice = Number(sp.price || p.price) || 0;
            const discountPercent = Number(sp.discount || p.discount) || 0;
            const discountedPrice = discountPercent > 0
                ? Math.floor(originalPrice * (1 - discountPercent / 100))
                : originalPrice;

            return {
                id: p._id,
                name: p.name,
                image: p.imageUrl || fallbackImg,
                originalPrice,
                discountedPrice,
                discount: discountPercent,
                brand: p.brand || 'Generic',
                popularity: Number(p.popularity) || 0,
                packSize: p.description && p.description.length > 5 ? p.description.substring(0, 15) : 'Single',
                category: sp.category?.name || 'Stationary'
            };
        };

        let transformedList = storeProducts
            .map(sp => transformProduct(sp))
            .filter(p => p !== null);

        // 4. Server-side Sorting
        if (sort) {
            switch (sort) {
                case "price-low":
                    transformedList.sort((a, b) => a.discountedPrice - b.discountedPrice);
                    break;
                case "price-high":
                    transformedList.sort((a, b) => b.discountedPrice - a.discountedPrice);
                    break;
                case "popularity":
                    transformedList.sort((a, b) => b.popularity - a.popularity);
                    break;
                default:
                    // default order from DB
                    break;
            }
        }

        // 5. Response Formatting
        // If it's a specific query (search, category, etc.), return a flat list
        // If it's the main store page view (no filters), return categorized
        if (search || category || brands || sort) {
            return res.status(200).json({
                featured: [],
                categories: [{
                    categoryName: category || "Search Results",
                    products: transformedList
                }]
            });
        }

        // Categorized View (Main Store Page)
        const featured = transformedList.filter((p, idx) => storeProducts[idx].isFeatured);
        const categoriesMap = {};
        transformedList.forEach((p) => {
            const catName = p.category;
            if (!categoriesMap[catName]) {
                categoriesMap[catName] = [];
            }
            categoriesMap[catName].push(p);
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
