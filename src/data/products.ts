import productPens from "@/assets/product-pens.png";
import productNotebooks from "@/assets/product-notebooks.png";
import productArt from "@/assets/product-art.png";
import productSchool from "@/assets/product-school.png";

export interface Product {
    id: string;
    name: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    packSize?: string;
    discount?: number;
    category: "Writing" | "Notebooks" | "Art" | "Office" | "School" | "Combo" | "Papers" | "Gift Sets";
    brand: string;
    rating: number; // 1-5
    popularity: number; // 0-100 score for sorting
}

// Base products to clone/modify
const baseImages = {
    Writing: productPens,
    Notebooks: productNotebooks,
    Art: productArt,
    Office: productSchool,
    School: productSchool,
    Combo: productSchool,
    Papers: productNotebooks,
    "Gift Sets": productArt,
};

const CATEGORIES = ["Writing", "Notebooks", "Art", "Office", "School", "Combo", "Papers", "Gift Sets"] as const;
const BRANDS = ["Faber-Castell", "Camlin", "Classmate", "Parker", "Doms", "Pilot", "Uniball", "Luxor"];

const generateProducts = () => {
    let products: Product[] = [];
    let idCounter = 1;

    CATEGORIES.forEach(category => {
        // Generate ~20 products per category
        for (let i = 1; i <= 20; i++) {
            const originalPrice = Math.floor(Math.random() * 500) + 50;
            const discount = Math.floor(Math.random() * 30); // 0-30% discount
            const discountedPrice = Math.floor(originalPrice * (1 - discount / 100));
            const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];

            products.push({
                id: `${category.toLowerCase().substr(0, 3)}-${i}`,
                name: `${brand} ${category} Item ${i} - Premium`,
                image: baseImages[category],
                originalPrice,
                discountedPrice,
                packSize: i % 3 === 0 ? "Pack of 3" : "Single",
                discount: discount > 5 ? discount : 0,
                category: category,
                brand: brand,
                rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
                popularity: Math.floor(Math.random() * 100),
            });
        }
    });
    return products;
};

export const allProducts: Product[] = generateProducts();

export const getProductsByCategory = (category: string) => {
    if (category === "All") return allProducts;
    return allProducts.filter((p) => p.category === category);
};

export const bestSellers = [...allProducts]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8); // Top 8

export const discountedProducts = [...allProducts]
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 8); // Top 8 discounted

export const writingEssentials = getProductsByCategory("Writing").slice(0, 8);
export const notebooks = getProductsByCategory("Notebooks").slice(0, 8);
export const artSupplies = getProductsByCategory("Art").slice(0, 8);
export const officeDesk = getProductsByCategory("Office").slice(0, 8);
export const schoolGear = getProductsByCategory("School").slice(0, 8);
export const combos = getProductsByCategory("Combo").slice(0, 8);
