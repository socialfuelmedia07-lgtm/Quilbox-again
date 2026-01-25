const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './Backend/.env' });

const API_URL = 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quilbox');

        // 1. Get/Create User & Token
        const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String, isVerified: Boolean }));
        let user = await User.findOne({ email: 'testCheckout@example.com' });
        if (!user) {
            user = await User.create({
                name: 'Test User',
                email: 'testCheckout@example.com',
                isVerified: true
            });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        console.log('1. Authenticated');

        // 2. Clear Cart
        await axios.delete(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } });
        console.log('2. Cart Cleared');

        // 3. Fetch Product
        const productsRes = await axios.get(`${API_URL}/products`);
        const product = productsRes.data[0];
        console.log(`3. Trying to add: ${product.name} (${product.id || product._id})`);

        // 4. Add to Cart
        const res = await axios.post(`${API_URL}/cart`, {
            productId: product.id || product._id,
            quantity: 1
        }, { headers: { Authorization: `Bearer ${token}` } });

        console.log('4. Add to Cart Response Status:', res.status);
        console.log('   Cart Items:', res.data.items.length);
        if (res.data.items.length > 0) {
            console.log('   Item in cart:', res.data.items[0].product.name);
        }

        process.exit(0);

    } catch (error) {
        console.error('\n--- FAILED ---');
        console.error(error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

runTest();
