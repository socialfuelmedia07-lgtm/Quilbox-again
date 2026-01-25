const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Product.countDocuments();
    const products = await Product.find({}).limit(5);
    console.log(`Total Products: ${count}`);
    console.log(JSON.stringify(products, null, 2));
    process.exit();
};

check();
