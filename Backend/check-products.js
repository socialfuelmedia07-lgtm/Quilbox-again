const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkStock = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quilbox');
        console.log('Connected to MongoDB');

        const products = await Product.find({}).limit(5);
        console.log(`Found ${products.length} products.`);

        products.forEach(p => {
            console.log(`- ${p.name} (ID: ${p._id}) | Stock: ${p.stock} | Price: ${p.price}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkStock();
